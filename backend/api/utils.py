from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        if isinstance(exc, ValidationError):
            response = Response({
                'error': 'Validation Error',
                'detail': str(exc),
            }, status=status.HTTP_400_BAD_REQUEST)
        elif isinstance(exc, IntegrityError):
            response = Response({
                'error': 'Database Error',
                'detail': 'A database error occurred.',
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            response = Response({
                'error': 'Server Error',
                'detail': str(exc),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response