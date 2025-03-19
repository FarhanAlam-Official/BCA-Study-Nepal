import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import logging
import base64
from io import BytesIO
from PIL import Image
import re

logger = logging.getLogger(__name__)

def is_data_url(url):
    """Check if the URL is a data URL."""
    return url.startswith('data:')

def get_image_size(img_url):
    """Get the size of an image from its URL."""
    try:
        response = requests.get(img_url, timeout=5)
        img = Image.open(BytesIO(response.content))
        return img.size
    except:
        return (0, 0)

def extract_college_favicon(url):
    """
    Extract favicon URL from a college website URL using a chain of attempts.
    Returns the first working favicon URL found or None if none work.
    """
    try:
        # Clean and normalize the URL
        url = url.strip().rstrip('/')
        original_url = url

        # Try both HTTPS and HTTP if needed
        def try_url_variants(url):
            if url.startswith('https://'):
                return [url, url.replace('https://', 'http://')]
            elif url.startswith('http://'):
                return [url, url.replace('http://', 'https://')]
            else:
                return [f'https://{url}', f'http://{url}']

        def check_favicon_url(favicon_url):
            """Helper function to check if a favicon URL is valid"""
            try:
                logger.debug(f"Checking favicon URL: {favicon_url}")
                response = requests.head(favicon_url, timeout=5, allow_redirects=True)
                if response.status_code == 200:
                    content_type = response.headers.get('content-type', '')
                    logger.debug(f"Content-Type for {favicon_url}: {content_type}")
                    if 'image' in content_type or any(ext in favicon_url.lower() for ext in ['.ico', '.png', '.jpg', '.jpeg', '.gif']):
                        return True
                else:
                    logger.debug(f"Status code {response.status_code} for {favicon_url}")
                return False
            except Exception as e:
                logger.debug(f"Error checking {favicon_url}: {str(e)}")
                return False

        # Try each URL variant (http/https)
        for base_url in try_url_variants(url):
            logger.debug(f"Trying base URL: {base_url}")
            parsed_url = urlparse(base_url)
            domain_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

            # Step 1: Try to get favicon from HTML
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
                logger.debug(f"Fetching HTML from {base_url}")
                response = requests.get(base_url, headers=headers, timeout=5, verify=False)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Look for any favicon link tags
                for rel in ['icon', 'shortcut icon', 'apple-touch-icon', 'apple-touch-icon-precomposed']:
                    links = soup.find_all('link', {'rel': rel})
                    logger.debug(f"Found {len(links)} links with rel='{rel}'")
                    for link in links:
                        href = link.get('href')
                        if href:
                            # Handle absolute and relative URLs
                            if href.startswith('http'):
                                favicon_url = href
                            elif href.startswith('//'):
                                favicon_url = f"{parsed_url.scheme}:{href}"
                            else:
                                favicon_url = urljoin(domain_url, href.lstrip('/'))
                            
                            logger.debug(f"Checking favicon from HTML: {favicon_url}")
                            if check_favicon_url(favicon_url):
                                logger.info(f"Found favicon in HTML at {favicon_url}")
                                return favicon_url
            except Exception as e:
                logger.debug(f"Failed to parse HTML for favicons from {base_url}: {str(e)}")

            # Step 2: Try common favicon locations
            common_locations = [
                '/favicon.ico',
                '/favicon.png',
                '/favicon-32x32.png',
                '/favicon-16x16.png',
                '/apple-touch-icon.png',
            ]

            for location in common_locations:
                favicon_url = f"{domain_url}{location}"
                logger.debug(f"Trying common location: {favicon_url}")
                if check_favicon_url(favicon_url):
                    logger.info(f"Found favicon at common location: {favicon_url}")
                    return favicon_url

        # If we get here, we've tried all variants and found nothing
        logger.warning(f"No valid favicon found for {original_url} after trying all variants")
        return None

    except Exception as e:
        logger.error(f"Error extracting favicon from {url}: {str(e)}")
        return None

def update_college_favicons(college_queryset=None):
    """
    Update favicons for all colleges in the queryset or all colleges if queryset is None.
    """
    from .models import College
    
    if college_queryset is None:
        college_queryset = College.objects.filter(website__isnull=False).exclude(website='')
    
    updated_count = 0
    failed_count = 0
    
    for college in college_queryset:
        if not college.website:
            continue
            
        logger.info(f"\nProcessing college: {college.name}")
        logger.info(f"Website URL: {college.website}")
        
        if not (college.logo or college.logo_url):  # Only update if no other logo sources exist
            try:
                favicon_url = extract_college_favicon(college.website)
                if favicon_url:
                    college.extracted_favicon = favicon_url
                    college.save(update_fields=['extracted_favicon'])
                    updated_count += 1
                    logger.info(f"Successfully updated favicon for college: {college.name}")
                    logger.info(f"Favicon URL: {favicon_url}")
                else:
                    failed_count += 1
                    logger.warning(f"No favicon found for college: {college.name}")
            except Exception as e:
                failed_count += 1
                logger.error(f"Failed to update favicon for college {college.name}: {str(e)}")
        else:
            logger.info(f"Skipping {college.name} - already has logo or logo_url")
    
    return {
        'updated': updated_count,
        'failed': failed_count,
        'total': updated_count + failed_count
    } 