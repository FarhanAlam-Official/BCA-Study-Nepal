from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserViewSet, 
    UserProfileView, 
    UserProfileUpdateView,
    PasswordResetView,
    PasswordResetConfirmView,
    GoogleAuthView,
    GoogleAuthCallbackView,
    InitializeGmailOAuthView,
    GmailOAuthCallbackView,
    RegisterView,
    VerifyOTPView,
    ResendOTPView,
    CancelRegistrationView
)

# Public endpoints that don't require authentication
public_urlpatterns = [
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('google/auth/', GoogleAuthView.as_view(), name='google_auth'),
    path('google/callback/', GoogleAuthCallbackView.as_view(), name='google_auth_callback'),
    path('gmail/auth/', InitializeGmailOAuthView.as_view(), name='gmail_auth'),
    path('gmail/callback/', GmailOAuthCallbackView.as_view(), name='gmail_callback'),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),
    path('cancel-registration/', CancelRegistrationView.as_view(), name='cancel_registration'),
]

# Protected endpoints that require authentication
router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    # Public endpoints first
    *public_urlpatterns,
    
    # Authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Protected endpoints
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='user_profile_update'),
    
    # Router URLs must come last to avoid conflicts
    path('', include(router.urls)),
] 