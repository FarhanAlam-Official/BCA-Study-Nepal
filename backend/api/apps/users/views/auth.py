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
            if not settings.GOOGLE_OAUTH2_CLIENT_ID or not settings.GOOGLE_OAUTH2_CLIENT_SECRET:
                logger.error("Google OAuth2 credentials not configured")
                return JsonResponse({"error": "Google OAuth2 not configured"}, status=500)

            # Allow insecure transport in development
            if settings.DEBUG:
                os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

            # Create flow configuration
            client_config = {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [settings.GOOGLE_OAUTH2_REDIRECT_URI]
                }
            }

            flow = Flow.from_client_config(
                client_config,
                scopes=settings.GOOGLE_OAUTH2_SCOPES
            )
            
            flow.redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI

            # Generate authorization URL with state
            authorization_url, state = flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                prompt='consent'
            )
            
            # Store state in session and make sure it persists
            request.session['oauth_state'] = state
            request.session.modified = True
            
            # Log the state for debugging
            logger.info(f"Generated state: {state}")
            logger.info(f"Session ID: {request.session.session_key}")
            logger.info(f"Session contents: {dict(request.session)}")
            
            return JsonResponse({
                "auth_url": authorization_url,
                "state": state  # Include state in response for verification
            })
            
        except Exception as e:
            logger.error(f"Error in GoogleAuthView: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthCallbackView(APIView):
    """Handle Google OAuth callback and token storage."""
    def get(self, request):
        try:
            # Get state from both session and query params
            session_state = request.session.get('oauth_state')
            query_state = request.GET.get('state')
            
            logger.info(f"Session state: {session_state}")
            logger.info(f"Query state: {query_state}")
            logger.info(f"Session contents: {dict(request.session)}")
            
            if not session_state or not query_state or session_state != query_state:
                logger.error(f"State mismatch - Session: {session_state}, Query: {query_state}")
                return redirect("http://localhost:5173/#/settings?oauth=error&reason=state_mismatch")
            
            # Create flow configuration
            client_config = {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [settings.GOOGLE_OAUTH2_REDIRECT_URI]
                }
            }
            
            flow = Flow.from_client_config(
                client_config,
                scopes=settings.GOOGLE_OAUTH2_SCOPES,
                state=session_state
            )
            
            flow.redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
            
            # Allow insecure transport in development
            if settings.DEBUG:
                os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
            
            # Get the authorization response
            authorization_response = request.build_absolute_uri()
            if authorization_response.startswith('https://'):
                authorization_response = 'http://' + authorization_response[8:]
            
            # Exchange the authorization code for credentials
            flow.fetch_token(authorization_response=authorization_response)
            credentials = flow.credentials
            
            # Save credentials
            token_path = os.path.join(settings.CREDENTIALS_DIR, 'gmail_token.pickle')
            os.makedirs(os.path.dirname(token_path), exist_ok=True)
            
            with open(token_path, 'wb') as token:
                pickle.dump(credentials, token)
            
            # Clear the oauth state from session after successful authentication
            request.session.pop('oauth_state', None)
            request.session.modified = True
            
            logger.info("Successfully saved Gmail OAuth2 token")
            return redirect("http://localhost:5173/#/settings?oauth=success")
            
        except Exception as e:
            logger.error(f"Error in GoogleAuthCallbackView: {str(e)}")
            return redirect(f"http://localhost:5173/#/settings?oauth=error&reason={str(e)}")

@method_decorator(csrf_exempt, name='dispatch')
class InitializeGmailOAuthView(View):
    """Initialize Gmail OAuth flow."""
    def get(self, request):
        try:
            # Create OAuth2 flow configuration
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
                scopes=settings.GOOGLE_OAUTH2_SCOPES
            )
            
            # Set the redirect URI
            flow.redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
            
            # Generate authorization URL and state
            authorization_url, state = flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                prompt='consent'  # Force consent screen to ensure refresh token
            )
            
            # Store state in session
            request.session['gmail_oauth_state'] = state
            
            # Return the authorization URL
            return JsonResponse({
                "auth_url": authorization_url,
                "state": state
            })
            
        except Exception as e:
            logger.error(f"Error in InitializeGmailOAuthView: {str(e)}")
            return JsonResponse({"error": f"Failed to initialize Gmail OAuth: {str(e)}"}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GmailOAuthCallbackView(View):
    """Handle Gmail OAuth callback and token storage."""
    def get(self, request):
        try:
            # Get state from session
            state = request.session.get('gmail_oauth_state')
            if not state:
                logger.error("No state found in session")
                return redirect(f"{settings.FRONTEND_URL}/#/settings?oauth=error&reason=invalid_state")

            # Create OAuth2 flow configuration
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
                scopes=settings.GOOGLE_OAUTH2_SCOPES,
                state=state
            )
            
            flow.redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI

            # Allow insecure transport in development
            if settings.DEBUG:
                os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

            # Get the authorization response URL
            authorization_response = request.build_absolute_uri()
            if authorization_response.startswith('https://'):
                authorization_response = 'http://' + authorization_response[8:]

            # Exchange the authorization code for credentials
            flow.fetch_token(authorization_response=authorization_response)
            credentials = flow.credentials

            # Save credentials in both pickle and JSON formats
            token_path = os.path.join(settings.CREDENTIALS_DIR, 'gmail_token.pickle')
            json_token_path = settings.GMAIL_TOKEN_PATH

            # Ensure the credentials directory exists
            os.makedirs(os.path.dirname(token_path), exist_ok=True)
            os.makedirs(os.path.dirname(json_token_path), exist_ok=True)

            # Save in pickle format
            with open(token_path, 'wb') as token:
                pickle.dump(credentials, token)
            
            # Save in JSON format
            creds_data = {
                'token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_uri': credentials.token_uri,
                'client_id': credentials.client_id,
                'client_secret': credentials.client_secret,
                'scopes': credentials.scopes
            }
            with open(json_token_path, 'w') as token:
                json.dump(creds_data, token)

            # Clear the oauth state from session
            request.session.pop('gmail_oauth_state', None)
            request.session.modified = True

            logger.info("Successfully saved Gmail OAuth2 token")
            return redirect(f"{settings.FRONTEND_URL}/#/settings?oauth=success")
            
        except Exception as e:
            logger.error(f"Error in GmailOAuthCallbackView: {str(e)}")
            return redirect(f"{settings.FRONTEND_URL}/#/settings?oauth=error&reason={str(e)}")

@method_decorator(csrf_exempt, name='dispatch')
class CheckGmailConnectionView(APIView):
    """Check if Gmail is connected and token is valid."""
    def get(self, request):
        try:
            # Check if token file exists
            token_path = os.path.join(settings.CREDENTIALS_DIR, 'gmail_token.pickle')
            if not os.path.exists(token_path):
                return JsonResponse({"isConnected": False})
            
            try:
                # Try to load and validate the token
                with open(token_path, 'rb') as token:
                    credentials = pickle.load(token)
                
                # Check if token is valid or can be refreshed
                if credentials.valid:
                    return JsonResponse({"isConnected": True})
                elif credentials.expired and credentials.refresh_token:
                    credentials.refresh(Request())
                    # Save refreshed credentials
                    with open(token_path, 'wb') as token:
                        pickle.dump(credentials, token)
                    return JsonResponse({"isConnected": True})
                else:
                    return JsonResponse({"isConnected": False})
                    
            except Exception as e:
                logger.error(f"Error checking Gmail token: {str(e)}")
                return JsonResponse({"isConnected": False})
                
        except Exception as e:
            logger.error(f"Error in CheckGmailConnectionView: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500) 