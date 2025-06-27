from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .models import Resource

@receiver(m2m_changed, sender=Resource.tags.through)
def limit_resource_tags(sender, instance, action, reverse, model, pk_set, **kwargs):
    """Signal to limit the number of tags per resource to 4"""
    if action == "pre_add":
        # Get current tags
        current_tags = instance.tags.all()
        
        # Calculate how many new tags can be added
        if pk_set is not None:
            allowed_new_tags = 4 - current_tags.count()
            if allowed_new_tags <= 0:
                # If we already have 4 or more tags, don't add any more
                pk_set.clear()
            elif len(pk_set) > allowed_new_tags:
                # If we're trying to add more tags than allowed, only add up to the limit
                pk_set_list = list(pk_set)
                pk_set.clear()
                pk_set.update(pk_set_list[:allowed_new_tags]) 