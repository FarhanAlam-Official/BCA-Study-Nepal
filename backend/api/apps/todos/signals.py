from django.db.models.signals import pre_save, post_save, pre_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import Todo

@receiver(pre_save, sender=Todo)
def update_todo_timestamps(sender, instance, **kwargs):
    """Update timestamps before saving a todo."""
    if not instance.id:  # New instance
        instance.created_at = timezone.now()
    instance.last_modified = timezone.now()

@receiver(post_save, sender=Todo)
def handle_todo_saved(sender, instance, created, **kwargs):
    """Handle actions after a todo is saved."""
    pass  # Add any post-save logic here if needed

@receiver(pre_delete, sender=Todo)
def handle_todo_deletion(sender, instance, **kwargs):
    """Handle actions before a todo is deleted."""
    pass  # Add any pre-delete cleanup logic here if needed 