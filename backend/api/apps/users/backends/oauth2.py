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
import json
import logging
import shutil

logger = logging.getLogger(__name__)

class OAuth2EmailBackend(BaseEmailBackend):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.credentials = None
        self._load_or_refresh_credentials()

    def _load_or_refresh_credentials(self):
        """Load or refresh OAuth2 credentials"""
        # Always try pickle format first to maintain existing functionality
        old_token_path = os.path.join(settings.CREDENTIALS_DIR, 'gmail_token.pickle')
        if os.path.exists(old_token_path):
            try:
                with open(old_token_path, 'rb') as token:
                    self.credentials = pickle.load(token)
                logger.info("Loaded credentials from pickle file: %s", old_token_path)
                
                # Only attempt migration if explicitly enabled
                if hasattr(settings, 'ENABLE_CREDENTIALS_MIGRATION') and settings.ENABLE_CREDENTIALS_MIGRATION:
                    if hasattr(settings, 'GMAIL_TOKEN_PATH'):
                        self._migrate_credentials(old_token_path)
            except Exception as e:
                logger.error("Error loading pickle credentials: %s", str(e))
                self.credentials = None

        # Only try JSON format if pickle failed and JSON file exists
        if not self.credentials and hasattr(settings, 'GMAIL_TOKEN_PATH') and os.path.exists(settings.GMAIL_TOKEN_PATH):
            try:
                with open(settings.GMAIL_TOKEN_PATH, 'r') as token:
                    creds_data = json.load(token)
                    self.credentials = Credentials.from_authorized_user_info(creds_data)
                logger.info("Loaded credentials from JSON file: %s", settings.GMAIL_TOKEN_PATH)
            except Exception as e:
                logger.error("Error loading JSON credentials: %s", str(e))
                self.credentials = None

        if not self.credentials or not self.credentials.valid:
            if self.credentials and self.credentials.expired and self.credentials.refresh_token:
                self.credentials.refresh(Request())
                self._save_credentials(old_token_path)  # Save in both formats
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
                raise Exception("Need to authorize Gmail access")

    def _save_credentials(self, pickle_path):
        """Save credentials in both pickle and JSON formats"""
        # Always save in pickle format first
        with open(pickle_path, 'wb') as token:
            pickle.dump(self.credentials, token)
        logger.info("Saved credentials to pickle file: %s", pickle_path)

        # Additionally save in JSON format if enabled
        if hasattr(settings, 'GMAIL_TOKEN_PATH'):
            try:
                creds_data = {
                    'token': self.credentials.token,
                    'refresh_token': self.credentials.refresh_token,
                    'token_uri': self.credentials.token_uri,
                    'client_id': self.credentials.client_id,
                    'client_secret': self.credentials.client_secret,
                    'scopes': self.credentials.scopes
                }
                
                os.makedirs(os.path.dirname(settings.GMAIL_TOKEN_PATH), exist_ok=True)
                
                with open(settings.GMAIL_TOKEN_PATH, 'w') as token:
                    json.dump(creds_data, token)
                logger.info("Saved credentials to JSON file: %s", settings.GMAIL_TOKEN_PATH)
            except Exception as e:
                logger.error("Error saving JSON credentials: %s", str(e))

    def _migrate_credentials(self, old_token_path):
        """Safely migrate credentials from pickle to JSON format"""
        try:
            # Create backup of pickle file first
            backup_path = old_token_path + '.backup'
            shutil.copy2(old_token_path, backup_path)
            logger.info("Created backup of pickle file: %s", backup_path)

            # Try to save in JSON format
            self._save_credentials(old_token_path)

            # Don't delete the old file yet, keep both formats
            logger.info("Successfully migrated credentials to JSON format")
        except Exception as e:
            logger.error("Error during credential migration: %s", str(e))
            # If we have a backup and something went wrong, restore it
            if os.path.exists(backup_path):
                shutil.copy2(backup_path, old_token_path)
                logger.info("Restored pickle file from backup")

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