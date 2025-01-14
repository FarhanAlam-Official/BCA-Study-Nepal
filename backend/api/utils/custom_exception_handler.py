from rest_framework.views import exception_handler
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is None:
        return Response({
            'error': str(exc),
            'detail': 'An unexpected error occurred.'
        }, status=500)

    return response 