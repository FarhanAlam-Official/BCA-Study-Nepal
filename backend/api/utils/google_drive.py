from django.conf import settings
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import io

class GoogleDriveStorage:
    def __init__(self):
        credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_DRIVE_CREDENTIALS_PATH,
            scopes=['https://www.googleapis.com/auth/drive.file']
        )
        self.service = build('drive', 'v3', credentials=credentials)

    def upload_file(self, file_obj, filename, folder_id=None):
        try:
            # Use folder_id from settings if not provided
            if folder_id is None:
                folder_id = settings.GOOGLE_DRIVE_FOLDER_ID

            # Convert Django UploadedFile to file-like object
            file_content = file_obj.read()
            file_obj.seek(0)  # Reset file pointer for future reads
            fh = io.BytesIO(file_content)

            # Prepare the file metadata
            file_metadata = {
                'name': filename,
                'mimeType': 'application/pdf',
                'parents': [folder_id]
            }

            # Create media object
            media = MediaIoBaseUpload(
                fh,
                mimetype='application/pdf',
                resumable=True
            )

            # Execute the upload
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, webViewLink'
            ).execute()

            return {
                'file_id': file.get('id'),
                'web_view_link': file.get('webViewLink')
            }

        except Exception as e:
            print(f"Google Drive upload error: {str(e)}")
            raise

    def delete_file(self, file_id):
        try:
            self.service.files().delete(fileId=file_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting file from Google Drive: {str(e)}")
            return False 