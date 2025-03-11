"""
TODO: This file has been split into separate files under views/ directory:
- auth.py: Google OAuth views
- password.py: Password management views
- profile.py: User profile views
- registration.py: User registration views
- otp.py: OTP-based registration views

This file can be safely deleted after verifying that all functionality works correctly with the new structure.
Keep this file as a reference until then.

Original file below:
"""

from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import (
    UserSerializer, 
    UserRegistrationSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect
from google_auth_oauthlib.flow import Flow
from rest_framework.views import APIView
import pickle
import os
import logging
import json
from django.core.exceptions import SuspiciousOperation
from django.http import HttpResponseBadRequest, HttpResponseServerError, JsonResponse
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from django.views import View

User = get_user_model()

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'register']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class UserProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetView(View):
    """
    View for initiating password reset process.
    This view is public and does not require authentication.
    """
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            serializer = PasswordResetSerializer(data=data)
            
            if serializer.is_valid():
                email = serializer.validated_data['email']
                redirect_url = serializer.validated_data.get('redirect_url')
                
                try:
                    user = User.objects.get(email=email)
                    # Generate password reset token
                    token = default_token_generator.make_token(user)
                    uid = urlsafe_base64_encode(force_bytes(user.pk))
                    
                    # Build reset URL using provided redirect_url or fallback to settings
                    base_url = redirect_url if redirect_url else settings.FRONTEND_URL
                    if not base_url.endswith('/'):
                        base_url += '/'
                    reset_url = f"{base_url}{uid}/{token}"
                    
                    logger.info(f"Sending password reset email to {email} with reset URL: {reset_url}")
                    
                    try:
                        # Send email
                        subject = 'Password Reset Request'
                        message = render_to_string('password_reset_email.html', {
                            'user': user,
                            'reset_url': reset_url,
                            'site_name': 'BCA Study Nepal'
                        })
                        
                        send_mail(
                            subject,
                            message,
                            settings.DEFAULT_FROM_EMAIL,
                            [user.email],
                            fail_silently=False,
                            html_message=message
                        )
                        
                        return JsonResponse({
                            "status": "success",
                            "detail": "If an account exists with this email, you will receive password reset instructions shortly."
                        }, status=200)
                    except Exception as e:
                        logger.error(f"Failed to send password reset email: {str(e)}")
                        return JsonResponse({
                            "status": "error",
                            "detail": "We encountered an issue sending the email. Please try again later."
                        }, status=500)
                        
                except User.DoesNotExist:
                    # We return success even if email doesn't exist for security
                    logger.warning(f"Password reset attempted for non-existent email: {email}")
                    return JsonResponse({
                        "status": "success",
                        "detail": "If an account exists with this email, you will receive password reset instructions shortly."
                    }, status=200)
                    
            return JsonResponse(
                {"status": "error", "detail": "Please provide a valid email address."},
                status=400
            )
            
        except json.JSONDecodeError:
            return JsonResponse({
                "status": "error",
                "detail": "Invalid request format."
            }, status=400)
        except Exception as e:
            logger.error(f"Unexpected error in password reset: {str(e)}")
            return JsonResponse({
                "status": "error",
                "detail": "An unexpected error occurred. Please try again later."
            }, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetConfirmView(View):
    """
    View for confirming password reset.
    This view is public and does not require authentication.
    """
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            serializer = PasswordResetConfirmSerializer(data=data)
            
            if serializer.is_valid():
                try:
                    uid = force_str(urlsafe_base64_decode(serializer.validated_data['uidb64']))
                    user = User.objects.get(pk=uid)
                    
                    if default_token_generator.check_token(user, serializer.validated_data['token']):
                        user.set_password(serializer.validated_data['new_password'])
                        user.save()
                        return JsonResponse(
                            {"detail": "Password has been reset successfully."},
                            status=200
                        )
                    return JsonResponse(
                        {"detail": "Invalid reset link or it has expired."},
                        status=400
                    )
                    
                except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                    return JsonResponse(
                        {"detail": "Invalid reset link or it has expired."},
                        status=400
                    )
                    
            return JsonResponse(serializer.errors, status=400)
            
        except json.JSONDecodeError:
            return JsonResponse({"detail": "Invalid JSON"}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error in password reset confirm: {str(e)}")
            return JsonResponse({"detail": "An unexpected error occurred"}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthView(APIView):
    permission_classes = []

    def get(self, request):
        try:
            if not settings.GOOGLE_OAUTH2_CLIENT_ID or not settings.GOOGLE_OAUTH2_CLIENT_SECRET:
                logger.error("Google OAuth2 credentials not configured")
                return HttpResponseServerError("Google OAuth2 not configured")

            # Allow insecure transport in development
            if settings.DEBUG:
                import os
                os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

            # Use the exact redirect URI from settings
            redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI

            logger.info(f"Using redirect URI: {redirect_uri}")

            # Create flow configuration
            client_config = {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [redirect_uri]
                }
            }

            flow = Flow.from_client_config(
                client_config,
                scopes=settings.GOOGLE_OAUTH2_SCOPES
            )
            
            flow.redirect_uri = redirect_uri

            # Generate authorization URL with state
            authorization_url, state = flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                prompt='consent'  # Force consent screen
            )
            
            # Store state and redirect URI in session as strings
            request.session['oauth_state'] = str(state)
            request.session['oauth_redirect_uri'] = str(redirect_uri)
            request.session.save()

            # Debug session
            logger.info(f"Session ID: {request.session.session_key}")
            logger.info(f"Stored state in session: {state}")
            logger.info(f"Session contents: {dict(request.session)}")
            
            response = redirect(authorization_url)
            response.set_cookie('oauth_state', str(state), httponly=False, samesite=None)
            return response
            
        except Exception as e:
            logger.error(f"Error in GoogleAuthView: {str(e)}")
            return HttpResponseServerError("Error initiating Google OAuth2 flow")

@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthCallbackView(APIView):
    permission_classes = []

    def get(self, request):
        try:
            # Debug incoming request
            logger.info(f"Callback headers: {dict(request.headers)}")
            logger.info(f"Callback cookies: {request.COOKIES}")
            logger.info(f"Session ID: {request.session.session_key}")
            logger.info(f"Session contents: {dict(request.session)}")
            
            # Get state from both session and query params
            session_state = request.session.get('oauth_state')
            cookie_state = request.COOKIES.get('oauth_state')
            query_state = request.GET.get('state')
            
            # Try to get state from any available source
            state = session_state or cookie_state or query_state
            
            # Use the exact redirect URI from settings
            redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
            
            logger.info(f"Callback received. Session state: {session_state}, Cookie state: {cookie_state}, Query state: {query_state}")
            logger.info(f"Using redirect URI: {redirect_uri}")
            
            if not state:
                logger.error("No state found in session, cookie, or query parameters")
                return HttpResponseBadRequest("No state found")
            
            # Create flow configuration
            client_config = {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [redirect_uri]
                }
            }
            
            flow = Flow.from_client_config(
                client_config,
                scopes=settings.GOOGLE_OAUTH2_SCOPES,
                state=state
            )
            
            flow.redirect_uri = redirect_uri
            
            try:
                # Allow insecure transport in development
                if settings.DEBUG:
                    import os
                    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
                
                authorization_response = request.build_absolute_uri()
                if authorization_response.startswith('https://'):
                    authorization_response = 'http://' + authorization_response[8:]
                
                flow.fetch_token(
                    authorization_response=authorization_response
                )
                
                credentials = flow.credentials
                token_path = os.path.join(settings.BASE_DIR, 'gmail_token.pickle')
                
                try:
                    os.makedirs(os.path.dirname(token_path), exist_ok=True)
                    with open(token_path, 'wb') as token:
                        pickle.dump(credentials, token)
                    logger.info("Successfully saved Gmail OAuth2 token")
                    return redirect("http://localhost:5173/#/settings?oauth=success")
                except Exception as e:
                    logger.error(f"Error saving token: {str(e)}")
                    return redirect("http://localhost:5173/#/settings?oauth=error&reason=token_save_failed")
                
            except Exception as e:
                logger.error(f"Error fetching token: {str(e)}")
                logger.error(f"Authorization response: {authorization_response}")
                return redirect("http://localhost:5173/#/settings?oauth=error&reason=token_fetch_failed")
            
        except Exception as e:
            logger.error(f"Error in GoogleAuthCallbackView: {str(e)}")
            return redirect("http://localhost:5173/#/settings?oauth=error&reason=general_error")

@method_decorator(csrf_exempt, name='dispatch')
class InitializeGmailOAuthView(View):
    """
    View to initialize Gmail OAuth2 flow.
    This is needed only once to set up the Gmail token.
    """
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
            
            flow.redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
            authorization_url, state = flow.authorization_url(access_type='offline', include_granted_scopes='true')
            
            # Store state in session
            request.session['gmail_oauth_state'] = state
            
            return redirect(authorization_url)
            
        except Exception as e:
            logger.error(f"Error initializing Gmail OAuth: {str(e)}")
            return JsonResponse({"error": "Failed to initialize Gmail OAuth"}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GmailOAuthCallbackView(View):
    """
    Callback view for Gmail OAuth2 flow.
    This handles saving the Gmail token.
    """
    def get(self, request):
        try:
            state = request.session.get('gmail_oauth_state')
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
                scopes=['https://www.googleapis.com/auth/gmail.send'],
                state=state
            )
            
            flow.redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
            flow.fetch_token(authorization_response=request.build_absolute_uri())
            
            # Save the credentials
            token_path = os.path.join(settings.BASE_DIR, 'gmail_token.pickle')
            with open(token_path, 'wb') as token:
                pickle.dump(flow.credentials, token)
            
            return JsonResponse({"message": "Gmail OAuth setup completed successfully"})
            
        except Exception as e:
            logger.error(f"Error in Gmail OAuth callback: {str(e)}")
            return JsonResponse({"error": "Failed to complete Gmail OAuth setup"}, status=500)

# OTP related functions
import random
import string
from datetime import datetime, timedelta
from django.template.loader import render_to_string
import datetime as dt

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    """
    Register a new user and send OTP for verification
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        logger.info(f"Registration request received: {request.data}")
        logger.info(f"Session ID: {request.session.session_key}")
        
        # Don't create serializer yet, just validate basic fields directly first
        username = request.data.get('username')
        email = request.data.get('email')
        
        # Check for existing username or email before proceeding
        if username and User.objects.filter(username=username).exists():
            return Response(
                {"username": ["User with that username already exists. Please choose a different username."]},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if email and User.objects.filter(email=email).exists():
            return Response(
                {"email": ["User with that email address already exists. Please use a different email or try logging in."]},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Now validate all the data with the serializer
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            # Instead of creating user now, store the validated data in session
            # Make sure we have a session
            if not request.session.session_key:
                request.session.create()
            
            # Store user data in session
            registration_data_key = f'registration_data_{email}'
            registration_data = serializer.validated_data.copy()
            # Remove confirm_password from data to store
            registration_data.pop('confirm_password', None)
            
            # Store the data as a serializable dictionary
            request.session[registration_data_key] = {
                'username': registration_data['username'],
                'email': registration_data['email'],
                'password': registration_data['password'],
                'first_name': registration_data.get('first_name', ''),
                'last_name': registration_data.get('last_name', ''),
                'timestamp': datetime.now().timestamp()  # Add timestamp for potential expiry
            }
            
            # Generate OTP
            otp = generate_otp()
            logger.info(f"Generated OTP for {email}: {otp}")
            
            # Store OTP in session with expiry (10 minutes)
            expiry = datetime.now() + timedelta(minutes=10)
            
            # Create a unique session key for this OTP
            otp_key = f'otp_{email}'
            
            # Store OTP data
            request.session[otp_key] = {
                'code': otp,
                'expiry': expiry.timestamp()
            }
            request.session.modified = True
            request.session.save()
            
            # Log session details for debugging
            logger.info(f"Session ID after saving data: {request.session.session_key}")
            logger.info(f"Session contains registration key {registration_data_key}: {registration_data_key in request.session}")
            logger.info(f"Session contains OTP key {otp_key}: {otp_key in request.session}")
            logger.info(f"All session keys: {list(request.session.keys())}")
            
            # Prepare email using HTML template
            subject = 'Your Verification Code - BCA Study Nepal'
            
            # Render HTML email using template
            html_message = render_to_string('otp_verification_email.html', {
                'user_first_name': registration_data.get('first_name', 'there'),
                'user_email': email,
                'otp': otp,
                'site_name': 'BCA Study Nepal',
                'current_year': dt.datetime.now().year,
                'logo_url': f"{settings.FRONTEND_URL}/assets/images/logo.png"
            })
            
            # Plain text version for email clients that don't support HTML
            plain_message = f"""
            Hello {registration_data.get('first_name', '')},
            
            Thank you for registering with BCA Study Nepal. Your verification code is:
            
            {otp}
            
            This code will expire in 10 minutes.
            
            If you didn't register for an account, please ignore this email.
            
            Best regards,
            BCA Study Nepal Team
            """
            
            try:
                # Send email with HTML
                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                    html_message=html_message
                )
                
                # Set cookie with session_id in response
                response = Response({
                    'status': 'success',
                    'message': 'Registration data received! Please verify your email with the OTP we sent.',
                    'session_id': request.session.session_key  # Include session ID for debugging
                }, status=status.HTTP_200_OK)  # Use 200 instead of 201 since no resource created yet
                
                return response
                
            except Exception as e:
                # If email fails, log the error and the OTP for testing
                logger.error(f"Failed to send OTP email: {str(e)}")
                logger.warning(f"DEVELOPMENT MODE - OTP for {email} is: {otp}")
                
                # Return response with OTP for development purposes only
                # In production, you should remove the OTP from the response
                if settings.DEBUG:
                    return Response({
                        'status': 'success',
                        'message': 'Registration data received, but email sending failed. Check server logs for OTP.',
                        'debug_otp': otp,  # REMOVE THIS IN PRODUCTION
                        'session_id': request.session.session_key
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'status': 'error',
                        'message': 'Failed to send verification email. Please try again.'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        logger.warning(f"Registration validation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class VerifyOTPView(APIView):
    """
    Verify OTP and create/activate user account
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        logger.info(f"OTP verification attempt for email: {email}")
        logger.info(f"Received OTP: {otp}")
        logger.info(f"Session ID: {request.session.session_key}")
        logger.info(f"Session keys: {list(request.session.keys())}")
        logger.info(f"Request headers: {dict(request.headers)}")
        
        if not email or not otp:
            logger.warning("Email or OTP missing from request")
            return Response({
                'status': 'error',
                'message': 'Email and OTP are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if OTP exists and is valid
        otp_key = f'otp_{email}'
        registration_data_key = f'registration_data_{email}'
        
        stored_otp_data = request.session.get(otp_key)
        registration_data = request.session.get(registration_data_key)
        
        logger.info(f"Stored OTP data for {otp_key}: {stored_otp_data}")
        logger.info(f"Found registration data: {registration_data_key in request.session}")
        
        if not stored_otp_data:
            logger.warning(f"No OTP found in session for email: {email}")
            
            # For debugging, list all session keys
            for key in request.session.keys():
                if key.startswith('otp_'):
                    logger.info(f"Found OTP key in session: {key}")
            
            return Response({
                'status': 'error',
                'message': 'Your verification code has expired or is invalid. Please register again.'
            }, status=status.HTTP_400_BAD_REQUEST)
                
        # Check if OTP has expired
        expiry = datetime.fromtimestamp(stored_otp_data['expiry'])
        
        if datetime.now() > expiry:
            # Remove expired OTP and registration data
            logger.warning(f"OTP expired for email: {email}")
            if otp_key in request.session:
                del request.session[otp_key]
            if registration_data_key in request.session:
                del request.session[registration_data_key]
            request.session.save()
            
            return Response({
                'status': 'error',
                'message': 'Your verification code has expired. Please register again.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Log the stored OTP and received OTP for comparison
        stored_otp = stored_otp_data['code']
        logger.info(f"Stored OTP: '{stored_otp}', Received OTP: '{otp}', Equal: {stored_otp == otp}")
        
        # Check if OTP matches
        if otp != stored_otp:
            logger.warning(f"OTP mismatch for email: {email}")
            return Response({
                'status': 'error',
                'message': 'Invalid verification code. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Check if we have registration data
            if not registration_data:
                logger.error(f"Registration data not found for email: {email}")
                return Response({
                    'status': 'error',
                    'message': 'Registration data not found. Please register again.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Now create the user with the stored registration data
            # Use User.objects.create_user to properly handle password hashing
            user = User.objects.create_user(
                username=registration_data['username'],
                email=registration_data['email'],
                password=registration_data['password'],
                first_name=registration_data['first_name'],
                last_name=registration_data['last_name'],
                is_active=True,  # User is active immediately since we've verified email
                is_verified=True  # Mark as verified
            )
            
            logger.info(f"User created and activated successfully: {email}")
            
            # Clear OTP and registration data from session
            del request.session[otp_key]
            del request.session[registration_data_key]
            request.session.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'status': 'success',
                'message': 'Email verified and account created successfully',
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)  # Use 201 now since we're creating the user
            
        except Exception as e:
            logger.error(f"Error during user creation: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'An error occurred during account creation'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class ResendOTPView(APIView):
    """
    Resend OTP for registration verification
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({
                'status': 'error',
                'message': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if we have registration data for this email
        registration_data_key = f'registration_data_{email}'
        registration_data = request.session.get(registration_data_key)
        
        if not registration_data:
            logger.warning(f"No registration data found for resend OTP request: {email}")
            return Response({
                'status': 'error',
                'message': 'No pending registration found for this email. Please register again.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Generate new OTP
            otp = generate_otp()
            logger.info(f"Generated new OTP for {email}: {otp}")
            
            # Store OTP in session with expiry (10 minutes)
            expiry = datetime.now() + timedelta(minutes=10)
            otp_key = f'otp_{email}'
            
            request.session[otp_key] = {
                'code': otp,
                'expiry': expiry.timestamp()
            }
            request.session.modified = True
            request.session.save()
            
            # Prepare email using HTML template
            subject = 'Your New Verification Code - BCA Study Nepal'
            
            # Render HTML email using template
            html_message = render_to_string('otp_resend_email.html', {
                'user_first_name': registration_data.get('first_name', 'there'),
                'user_email': email,
                'otp': otp,
                'site_name': 'BCA Study Nepal',
                'current_year': dt.datetime.now().year,
                'logo_url': f"{settings.FRONTEND_URL}/assets/images/logo.png"
            })
            
            # Plain text version for email clients that don't support HTML
            plain_message = f"""
            Hello {registration_data.get('first_name', '')},
            
            Here's your new verification code:
            
            {otp}
            
            This code will expire in 10 minutes.
            
            Best regards,
            BCA Study Nepal Team
            """
            
            # Send email with HTML
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
                html_message=html_message
            )
            
            return Response({
                'status': 'success',
                'message': 'A new verification code has been sent to your email'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Failed to resend OTP: {str(e)}")
            
            if settings.DEBUG:
                # For development, return the OTP
                return Response({
                    'status': 'success',
                    'message': 'Failed to send email, but OTP generated. Check logs.',
                    'debug_otp': otp if 'otp' in locals() else None
                }, status=status.HTTP_200_OK)
            
            return Response({
                'status': 'error',
                'message': 'Failed to resend verification code'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class CancelRegistrationView(APIView):
    """
    Cancel registration and clean up session data
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({
                'status': 'error',
                'message': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Clean up session data
            registration_data_key = f'registration_data_{email}'
            otp_key = f'otp_{email}'
            
            # Check if we had any data
            had_registration_data = registration_data_key in request.session
            had_otp_data = otp_key in request.session
            
            # Remove data if it exists
            if had_registration_data:
                del request.session[registration_data_key]
            
            if had_otp_data:
                del request.session[otp_key]
            
            request.session.modified = True
            request.session.save()
            
            logger.info(f"Registration cancelled for {email}. " +
                      f"Cleaned up data: registration={had_registration_data}, OTP={had_otp_data}")
            
            return Response({
                'status': 'success',
                'message': 'Registration cancelled successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error during registration cancellation: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'An error occurred during cancellation'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 