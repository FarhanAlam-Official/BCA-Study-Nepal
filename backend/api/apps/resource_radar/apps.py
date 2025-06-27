from django.apps import AppConfig

class ResourceRadarConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.apps.resource_radar'
    label = 'resource_radar'  # This is important for model app_label
    verbose_name = 'Resource Radar'

    def ready(self):
        try:
            import api.apps.resource_radar.signals  # noqa
        except ImportError:
            pass 