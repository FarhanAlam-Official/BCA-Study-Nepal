"""
User profile related views.
"""
from rest_framework import permissions, generics
from django.contrib.auth import get_user_model
from ..serializers import UserSerializer

User = get_user_model()

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