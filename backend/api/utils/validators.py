import os
from django.core.exceptions import ValidationError
from .constants import MAX_UPLOAD_SIZE, ALLOWED_UPLOAD_EXTENSIONS

def validate_file_size(file):
    """Validate that the file size is under the maximum allowed size."""
    if file.size > MAX_UPLOAD_SIZE:
        raise ValidationError(f'File size cannot exceed {MAX_UPLOAD_SIZE/1024/1024}MB')

def validate_file_extension(file):
    """Validate that the file extension is allowed."""
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ALLOWED_UPLOAD_EXTENSIONS:
        raise ValidationError(f'File type not supported. Allowed types: {", ".join(ALLOWED_UPLOAD_EXTENSIONS)}')

def validate_phone_number(value):
    """Validate that the phone number is in a valid format."""
    import re
    if not re.match(r'^\+?1?\d{9,15}$', value):
        raise ValidationError('Phone number must be entered in the format: "+999999999"')

def validate_password_strength(password):
    """Validate that the password meets minimum strength requirements."""
    if len(password) < 8:
        raise ValidationError('Password must be at least 8 characters long')
    if not any(char.isdigit() for char in password):
        raise ValidationError('Password must contain at least one number')
    if not any(char.isupper() for char in password):
        raise ValidationError('Password must contain at least one uppercase letter')
    if not any(char.islower() for char in password):
        raise ValidationError('Password must contain at least one lowercase letter') 