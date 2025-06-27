"""
Password management views including reset and change functionality.
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from ..serializers import PasswordResetSerializer, PasswordResetConfirmSerializer
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

class PasswordResetView(APIView):
    """
    Handle password reset requests.
    Sends a password reset email with a token.
    """
    def post(self, request):
        try:
            serializer = PasswordResetSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            
            if user:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Get frontend URL from settings, ensure no trailing slash
                frontend_url = settings.FRONTEND_URL.rstrip('/')
                # Add hash for HashRouter
                reset_url = f"{frontend_url}/#/reset-password/{uid}/{token}"
                
                context = {
                    'user': user,
                    'reset_url': reset_url,
                    'site_name': 'BCA Study Nepal'
                }
                
                email_html = render_to_string('password_reset_email.html', context)
                email_subject = 'Password Reset Request'
                
                send_mail(
                    subject=email_subject,
                    message='',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    html_message=email_html
                )
            
            return Response({
                'message': 'Password reset instructions sent if email exists'
            })
            
        except Exception as e:
            logger.error(f"Error in password reset: {str(e)}")
            return Response(
                {'error': 'Failed to process password reset'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PasswordResetConfirmView(APIView):
    """
    Handle password reset confirmation.
    Validates the token and updates the password.
    """
    def post(self, request):
        try:
            uid = request.data.get('uid')
            token = request.data.get('token')
            # Accept either password or new_password
            password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')
            
            if not all([uid, token, password]):
                return Response(
                    {'error': 'Missing required fields'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # If confirm_password is provided, validate it matches
            if confirm_password and password != confirm_password:
                return Response(
                    {'error': 'Passwords do not match'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                uid = force_str(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return Response(
                    {'error': 'Invalid reset link'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({'message': 'Password reset successful'})
            else:
                return Response(
                    {'error': 'Invalid or expired reset link'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error in password reset confirmation: {str(e)}")
            return Response(
                {'error': 'Failed to reset password'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChangePasswordView(APIView):
    """
    Handle password change for authenticated users.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')
            
            if not all([old_password, new_password]):
                return Response(
                    {'error': 'Both old and new passwords are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not user.check_password(old_password):
                return Response(
                    {'error': 'Current password is incorrect'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password changed successfully'})
            
        except Exception as e:
            logger.error(f"Error in password change: {str(e)}")
            return Response(
                {'error': 'Failed to change password'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 