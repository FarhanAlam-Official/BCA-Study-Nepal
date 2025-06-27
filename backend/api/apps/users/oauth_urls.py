from django.urls import path
from .views import GoogleAuthCallbackView

urlpatterns = [
    path('', GoogleAuthCallbackView.as_view(), name='google_auth_callback_alt'),
] 