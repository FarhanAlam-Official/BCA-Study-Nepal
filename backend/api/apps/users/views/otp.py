"""
OTP-related views for user registration and verification.
"""
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
import random
import string
import logging
import datetime as dt
from datetime import datetime, timedelta
from ..serializers import UserRegistrationSerializer

User = get_user_model()
logger = logging.getLogger(__name__)

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    """Register a new user and send OTP for verification"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        logger.info(f"Registration request received: {request.data}")
        logger.info(f"Session ID: {request.session.session_key}")
        
        username = request.data.get('username')
        email = request.data.get('email')
        
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
        
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            if not request.session.session_key:
                request.session.create()
            
            registration_data_key = f'registration_data_{email}'
            registration_data = serializer.validated_data.copy()
            registration_data.pop('confirm_password', None)
            
            request.session[registration_data_key] = {
                'username': registration_data['username'],
                'email': registration_data['email'],
                'password': registration_data['password'],
                'first_name': registration_data.get('first_name', ''),
                'last_name': registration_data.get('last_name', ''),
                'timestamp': datetime.now().timestamp()
            }
            
            otp = generate_otp()
            logger.info(f"Generated OTP for {email}: {otp}")
            
            expiry = datetime.now() + timedelta(minutes=10)
            otp_key = f'otp_{email}'
            
            request.session[otp_key] = {
                'code': otp,
                'expiry': expiry.timestamp()
            }
            request.session.modified = True
            request.session.save()
            
            subject = 'Your Verification Code - BCA Study Nepal'
            
            html_message = render_to_string('otp_verification_email.html', {
                'user_first_name': registration_data.get('first_name', 'there'),
                'user_email': email,
                'otp': otp,
                'site_name': 'BCA Study Nepal',
                'current_year': dt.datetime.now().year,
                'logo_url': f"{settings.FRONTEND_URL}/assets/images/logo.png"
            })
            
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
                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                    html_message=html_message
                )
                
                response = Response({
                    'status': 'success',
                    'message': 'Registration data received! Please verify your email with the OTP we sent.',
                    'session_id': request.session.session_key
                }, status=status.HTTP_200_OK)
                
                return response
                
            except Exception as e:
                logger.error(f"Failed to send OTP email: {str(e)}")
                logger.warning(f"DEVELOPMENT MODE - OTP for {email} is: {otp}")
                
                if settings.DEBUG:
                    return Response({
                        'status': 'success',
                        'message': 'Registration data received, but email sending failed. Check server logs for OTP.',
                        'debug_otp': otp,
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
    """Verify OTP and create/activate user account"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:
            return Response({
                'status': 'error',
                'message': 'Email and OTP are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        otp_key = f'otp_{email}'
        registration_data_key = f'registration_data_{email}'
        
        stored_otp_data = request.session.get(otp_key)
        registration_data = request.session.get(registration_data_key)
        
        if not stored_otp_data:
            return Response({
                'status': 'error',
                'message': 'Your verification code has expired or is invalid. Please register again.'
            }, status=status.HTTP_400_BAD_REQUEST)
                
        expiry = datetime.fromtimestamp(stored_otp_data['expiry'])
        
        if datetime.now() > expiry:
            if otp_key in request.session:
                del request.session[otp_key]
            if registration_data_key in request.session:
                del request.session[registration_data_key]
            request.session.save()
            
            return Response({
                'status': 'error',
                'message': 'Your verification code has expired. Please register again.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        stored_otp = stored_otp_data['code']
        
        if otp != stored_otp:
            return Response({
                'status': 'error',
                'message': 'Invalid verification code. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if not registration_data:
                return Response({
                    'status': 'error',
                    'message': 'Registration data not found. Please register again.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.create_user(
                username=registration_data['username'],
                email=registration_data['email'],
                password=registration_data['password'],
                first_name=registration_data['first_name'],
                last_name=registration_data['last_name'],
                is_active=True,
                is_verified=True
            )
            
            del request.session[otp_key]
            del request.session[registration_data_key]
            request.session.save()
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'status': 'success',
                'message': 'Email verified and account created successfully',
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error during user creation: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'An error occurred during account creation'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class ResendOTPView(APIView):
    """Resend OTP for registration verification"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({
                'status': 'error',
                'message': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        registration_data_key = f'registration_data_{email}'
        registration_data = request.session.get(registration_data_key)
        
        if not registration_data:
            return Response({
                'status': 'error',
                'message': 'No pending registration found for this email. Please register again.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            otp = generate_otp()
            expiry = datetime.now() + timedelta(minutes=10)
            otp_key = f'otp_{email}'
            
            request.session[otp_key] = {
                'code': otp,
                'expiry': expiry.timestamp()
            }
            request.session.modified = True
            request.session.save()
            
            subject = 'Your New Verification Code - BCA Study Nepal'
            
            html_message = render_to_string('otp_resend_email.html', {
                'user_first_name': registration_data.get('first_name', 'there'),
                'user_email': email,
                'otp': otp,
                'site_name': 'BCA Study Nepal',
                'current_year': dt.datetime.now().year,
                'logo_url': f"{settings.FRONTEND_URL}/assets/images/logo.png"
            })
            
            plain_message = f"""
            Hello {registration_data.get('first_name', '')},
            
            Here's your new verification code:
            
            {otp}
            
            This code will expire in 10 minutes.
            
            Best regards,
            BCA Study Nepal Team
            """
            
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
                return Response({
                    'status': 'success',
                    'message': 'Failed to send email, but OTP generated. Check logs.',
                    'debug_otp': otp
                }, status=status.HTTP_200_OK)
            
            return Response({
                'status': 'error',
                'message': 'Failed to send verification code. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class CancelRegistrationView(APIView):
    """Cancel a pending registration and clean up session data"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({
                'status': 'error',
                'message': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        otp_key = f'otp_{email}'
        registration_data_key = f'registration_data_{email}'
        
        # Clean up session data
        if otp_key in request.session:
            del request.session[otp_key]
        if registration_data_key in request.session:
            del request.session[registration_data_key]
        request.session.save()
        
        return Response({
            'status': 'success',
            'message': 'Registration cancelled successfully'
        }, status=status.HTTP_200_OK) 