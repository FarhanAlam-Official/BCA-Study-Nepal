from django.apps import AppConfig


class TodosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.apps.todos'
    label = 'todos'

    def ready(self):
        try:
            import api.apps.todos.signals  # noqa
        except ImportError:
            pass 