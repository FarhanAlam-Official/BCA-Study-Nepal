import os
from django.core.exceptions import ValidationError

def validate_image_file(value):
    """
    Validates that the uploaded file is an image and within size limits
    """
    if not value:
        return
        
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension. Please use: .jpg, .jpeg, .png, or .gif')
    if value.size > 5 * 1024 * 1024:  # 5MB limit
        raise ValidationError('File size too large. Size should not exceed 5MB.')

def profile_picture_path(instance, filename):
    """
    Generates the upload path for user profile pictures
    Format: profile_pictures/user_id/username.extension
    """
    # Get the file extension
    ext = os.path.splitext(filename)[1]
    # Return the new path
    return f'profile_pictures/{instance.id}/{instance.username}{ext}' 