from django.core.management.base import BaseCommand
from django.conf import settings
import os
import pickle
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

class Command(BaseCommand):
    help = 'Check Gmail OAuth token status'

    def handle(self, *args, **options):
        token_path = os.path.join(settings.BASE_DIR, 'gmail_token.pickle')
        
        self.stdout.write('\nChecking Gmail token status...\n')
        
        # Check if token file exists
        if not os.path.exists(token_path):
            self.stdout.write(self.style.ERROR(
                f'Token file not found at: {token_path}\n'
                f'Please authorize by visiting: http://localhost:8000/api/auth/google/auth/'
            ))
            return
            
        try:
            # Load the credentials
            with open(token_path, 'rb') as token:
                credentials = pickle.load(token)
                
            self.stdout.write('Token Information:')
            self.stdout.write(f'Token file location: {token_path}')
            self.stdout.write(f'Token expired: {credentials.expired}')
            self.stdout.write(f'Has refresh token: {bool(credentials.refresh_token)}')
            
            # Try to refresh if expired
            if credentials.expired and credentials.refresh_token:
                self.stdout.write('\nToken is expired, attempting to refresh...')
                credentials.refresh(Request())
                
                # Save refreshed credentials
                with open(token_path, 'wb') as token:
                    pickle.dump(credentials, token)
                self.stdout.write(self.style.SUCCESS('Token refreshed successfully!'))
            
            if credentials.valid:
                self.stdout.write(self.style.SUCCESS('\nToken is valid and ready to use! ✅'))
            else:
                self.stdout.write(self.style.ERROR('\nToken is invalid! Please reauthorize.'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\nError checking token: {str(e)}'))
            self.stdout.write(self.style.WARNING(
                '\nPlease try reauthorizing by visiting:'
                '\nhttp://localhost:8000/api/auth/google/auth/'
            )) 