"""
Views for user management and authentication.
"""

from .registration import UserViewSet
from .profile import UserProfileView, UserProfileUpdateView
from .password import PasswordResetView, PasswordResetConfirmView, ChangePasswordView
from .auth import (
    GoogleAuthView,
    GoogleAuthCallbackView,
    InitializeGmailOAuthView,
    GmailOAuthCallbackView,
    CheckGmailConnectionView,
)
from .otp import (
    RegisterView,
    VerifyOTPView,
    ResendOTPView,
    CancelRegistrationView,
)

__all__ = [
    'UserViewSet',
    'UserProfileView',
    'UserProfileUpdateView',
    'PasswordResetView',
    'PasswordResetConfirmView',
    'ChangePasswordView',
    'GoogleAuthView',
    'GoogleAuthCallbackView',
    'InitializeGmailOAuthView',
    'GmailOAuthCallbackView',
    'CheckGmailConnectionView',
    'RegisterView',
    'VerifyOTPView',
    'ResendOTPView',
    'CancelRegistrationView',
] 