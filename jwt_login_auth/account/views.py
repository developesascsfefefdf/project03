from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import (UserRegistrationSerializer, UserLoginSerializer,
                          UserProfileSerializer, UserChangePasswordSerializer,
                          ResetPasswordSerializer, UserPasswordResetSerializer,
                          UserInviteSerializer)
from django.contrib.auth import authenticate
from .renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
import uuid
from .models import Invitation

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class InviteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a unique token for the invitation
        token = str(uuid.uuid4())
        invitation = Invitation.objects.create(email=email, token=token)

        # Build the registration URL
        registration_url = request.build_absolute_uri(
            reverse('register') + f'?token={token}'
        )

        # Send the email
        send_mail(
            'You are invited!',
            f'Please register using the following link: {registration_url}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return Response({'message': 'Invitation sent successfully'}, status=status.HTTP_200_OK)

class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'msg': 'Registration successful!', 'token': token}, status=status.HTTP_201_CREATED)
        return Response({'msg': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = request.data.get('email')
            password = request.data.get('password')
            user = authenticate(email=email, password=password)
            if user:
                token = get_tokens_for_user(user)
                return Response({'msg': 'Login successful!', 'token': token}, status=status.HTTP_200_OK)
            return Response({'errors': {'non_field_errors': ['User does not exist!']}}, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'Password changed successfully!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordEmailView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'Password reset link sent. Check your email.'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid': uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'Password reset successfully!'}, status=status.HTTP_200_OK)
