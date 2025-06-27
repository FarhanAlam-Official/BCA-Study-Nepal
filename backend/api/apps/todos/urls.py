from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TodoViewSet

router = DefaultRouter()
router.register(r'', TodoViewSet, basename='todo')

# The router will handle these URLs:
# / - GET (list), POST (create)
# /{id}/ - GET (retrieve), PUT/PATCH (update), DELETE
# /{id}/add_subtask/ - POST
# /{id}/toggle_subtask/ - POST
# /{id}/add_comment/ - POST
# /{id}/share/ - POST
# /{id}/unshare/ - POST

urlpatterns = [
    path('', include(router.urls)),
] 