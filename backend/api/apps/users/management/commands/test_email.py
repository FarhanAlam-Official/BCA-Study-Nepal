from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

class Command(BaseCommand):
    help = 'Test OAuth2 email configuration by sending a test email'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            help='Email address to send test email to',
            required=True
        )

    def handle(self, *args, **options):
        test_email = options['email']
        
        self.stdout.write(self.style.HTTP_INFO('\nTesting OAuth2 email configuration...'))
        
        try:
            # Test sending HTML email using template
            context = {
                'user': {'username': 'Test User'},
                'reset_url': f"{settings.FRONTEND_URL}/reset-password/test-uid/test-token",
                'site_name': 'BCA Study Nepal'
            }
            
            # Render email template
            email_html = render_to_string('password_reset_email.html', context)
            
            # Send HTML email
            send_mail(
                subject='Test Email from BCA Study Nepal',
                message='This is a test email to verify the OAuth2 configuration.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[test_email],
                fail_silently=False,
                html_message=email_html
            )
            self.stdout.write(self.style.SUCCESS('\nEmail sent successfully! 🎉'))
            self.stdout.write(f'\nPlease check {test_email} for the test email.')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\nFailed to send email: {str(e)}'))
            self.stdout.write(self.style.WARNING('\nTroubleshooting steps:'))
            self.stdout.write('1. Make sure you have authorized the application at: http://localhost:8000/api/auth/google/auth/')
            self.stdout.write('2. Check if gmail_token.pickle exists in your project root')
            self.stdout.write('3. Verify your Google Cloud Console configuration')
            self.stdout.write('4. Check if the Gmail API is enabled in Google Cloud Console') 