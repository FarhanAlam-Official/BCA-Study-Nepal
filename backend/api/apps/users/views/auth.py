"""
Authentication related views including Google OAuth and Gmail OAuth.
"""
from rest_framework import permissions
from rest_framework.views import APIView
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import redirect
from django.http import JsonResponse
from django.conf import settings
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import os
import pickle
import json
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthView(APIView):
    """Handle Google OAuth authentication initiation."""
    def get(self, request):
        try:
            flow = Flow.from_client_config(
                {
                    "web": {
                        "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                        "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "redirect_uris": [settings.GOOGLE_OAUTH2_REDIRECT_URI]
                    }
                },
                scopes=['https://www.googleapis.com/auth/gmail.send']
            )
            auth_url, _ = flow.authorization_url(prompt='consent')
            return JsonResponse({"auth_url": auth_url})
        except Exception as e:
            logger.error(f"Error in GoogleAuthView: {str(e)}")
            return JsonResponse({"error": "Failed to initialize Google OAuth"}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthCallbackView(APIView):
    """Handle Google OAuth callback and token storage."""
    def get(self, request):
        try:
            # Your existing GoogleAuthCallbackView code
            pass
        except Exception as e:
            logger.error(f"Error in GoogleAuthCallbackView: {str(e)}")
            return JsonResponse({"error": "Authentication failed"}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class InitializeGmailOAuthView(View):
    """Initialize Gmail OAuth flow."""
    def get(self, request):
        try:
            # Your existing InitializeGmailOAuthView code
            pass
        except Exception as e:
            logger.error(f"Error in InitializeGmailOAuthView: {str(e)}")
            return JsonResponse({"error": "Failed to initialize Gmail OAuth"}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GmailOAuthCallbackView(View):
    """Handle Gmail OAuth callback and token storage."""
    def get(self, request):
        try:
            # Your existing GmailOAuthCallbackView code
            pass
        except Exception as e:
            logger.error(f"Error in GmailOAuthCallbackView: {str(e)}")
            return JsonResponse({"error": "Failed to complete Gmail OAuth"}, status=500) 