import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import logging
import random

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
        domain = parsed_url.netloc.replace('www.', '')
        
        # List of common User-Agent strings
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        ]
        
        # Enhanced headers
        headers = {
            'User-Agent': random.choice(user_agents),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        }

        # Known favicon services - if direct access fails, try these
        favicon_services = [
            f"https://www.google.com/s2/favicons?domain={domain}&sz=64",
            f"https://icon.horse/icon/{domain}",
            f"https://favicon.splitbee.io/{domain}"
        ]
        
        try:
            # Try to fetch the page
            response = requests.get(url, headers=headers, timeout=10)
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
                            try:
                                favicon_response = requests.head(favicon_url, headers=headers, timeout=5)
                                if favicon_response.status_code == 200:
                                    return favicon_url
                            except:
                                continue
            
            # If no favicon found in HTML, try the default location
            default_favicon = urljoin(base_url, '/favicon.ico')
            try:
                favicon_response = requests.head(default_favicon, headers=headers, timeout=5)
                if favicon_response.status_code == 200:
                    return default_favicon
            except:
                pass
                
        except Exception as page_error:
            logger.warning(f"Could not fetch page {url}: {str(page_error)}")
        
        # If direct methods fail, try favicon services
        for service_url in favicon_services:
            try:
                response = requests.head(service_url, timeout=5)
                if response.status_code == 200:
                    return service_url
            except:
                continue
        
        # If all else fails, use Google's favicon service as fallback
        return f"https://www.google.com/s2/favicons?domain={domain}&sz=64"
        
    except Exception as e:
        logger.error(f"Error extracting favicon from {url}: {str(e)}")
        # Return Google's favicon service as ultimate fallback
        try:
            domain = urlparse(url).netloc.replace('www.', '')
            return f"https://www.google.com/s2/favicons?domain={domain}&sz=64"
        except:
            return None 