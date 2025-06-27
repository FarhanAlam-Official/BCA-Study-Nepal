# Authentication
TOKEN_LIFETIME = {
    'ACCESS_TOKEN': 24,  # hours
    'REFRESH_TOKEN': 30,  # days
}

# Pagination
DEFAULT_PAGE_SIZE = 10
MAX_PAGE_SIZE = 100

# File Upload
MAX_UPLOAD_SIZE = 5242880  # 5MB in bytes
ALLOWED_UPLOAD_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png']

# Cache
CACHE_TTL = {
    'DEFAULT': 300,  # 5 minutes
    'SUBJECT_LIST': 3600,  # 1 hour
    'USER_PROFILE': 1800,  # 30 minutes
}

# API Rate Limiting
RATE_LIMIT = {
    'DEFAULT': '100/hour',
    'AUTH': '5/minute',
    'USER_CREATE': '3/hour',
} 