import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import logging

logger = logging.getLogger(__name__)

def extract_favicon(url):
    """
    Extract favicon URL from a given website URL.
    Returns the favicon URL or None if not found.
    """
    try:
        # Add scheme if not present
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url

        # Get the base domain
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        
        # Try to fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # List of possible favicon locations, in order of preference
        favicon_locations = [
            # Check for apple-touch-icon
            ('link', {'rel': ['apple-touch-icon']}),
            ('link', {'rel': ['apple-touch-icon-precomposed']}),
            # Check for modern favicon in various sizes
            ('link', {'rel': ['icon']}),
            # Check for classic favicon
            ('link', {'rel': ['shortcut icon']}),
            ('link', {'rel': ['favicon']}),
        ]
        
        # Try each possible favicon location
        for tag, attrs in favicon_locations:
            icons = soup.find_all(tag, attrs)
            if icons:
                for icon in icons:
                    if icon.get('href'):
                        favicon_url = urljoin(base_url, icon['href'])
                        # Verify if the favicon URL is accessible
                        try:
                            favicon_response = requests.head(favicon_url, timeout=5)
                            if favicon_response.status_code == 200:
                                return favicon_url
                        except:
                            continue
        
        # If no favicon found in HTML, try the default location
        default_favicon = urljoin(base_url, '/favicon.ico')
        try:
            favicon_response = requests.head(default_favicon, timeout=5)
            if favicon_response.status_code == 200:
                return default_favicon
        except:
            pass
        
        return None
        
    except Exception as e:
        logger.error(f"Error extracting favicon from {url}: {str(e)}")
        return None 