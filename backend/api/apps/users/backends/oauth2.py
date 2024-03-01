from django.core.mail.backends.base import BaseEmailBackend
from django.conf import settings
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from email.mime.text import MIMEText
import base64
import pickle
import os

class OAuth2EmailBackend(BaseEmailBackend):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.credentials = None
        self._load_or_refresh_credentials()

    def _load_or_refresh_credentials(self):
        """Load or refresh OAuth2 credentials"""
        token_path = os.path.join(settings.BASE_DIR, 'gmail_token.pickle')
        
        if os.path.exists(token_path):
            with open(token_path, 'rb') as token:
                self.credentials = pickle.load(token)

        if not self.credentials or not self.credentials.valid:
            if self.credentials and self.credentials.expired and self.credentials.refresh_token:
                self.credentials.refresh(Request())
            else:
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
                # This will raise an error - we need to handle authorization in views
                raise Exception("Need to authorize Gmail access")

            # Save the credentials
            with open(token_path, 'wb') as token:
                pickle.dump(self.credentials, token)

    def send_messages(self, email_messages):
        """Send email messages using Gmail API"""
        if not email_messages:
            return 0

        try:
            service = build('gmail', 'v1', credentials=self.credentials)
            num_sent = 0

            for email_message in email_messages:
                try:
                    message = MIMEText(email_message.body)
                    message['to'] = ', '.join(email_message.to)
                    message['from'] = email_message.from_email
                    message['subject'] = email_message.subject

                    # If there's HTML content
                    if hasattr(email_message, 'alternatives') and email_message.alternatives:
                        for alternative in email_message.alternatives:
                            content, mime_type = alternative
                            if mime_type == 'text/html':
                                message = MIMEText(content, 'html')
                                message['to'] = ', '.join(email_message.to)
                                message['from'] = email_message.from_email
                                message['subject'] = email_message.subject
                                break

                    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
                    service.users().messages().send(
                        userId='me',
                        body={'raw': raw_message}
                    ).execute()
                    num_sent += 1
                except Exception as e:
                    if not self.fail_silently:
                        raise
            return num_sent

        except Exception as e:
            if not self.fail_silently:
                raise
            return 0 