import logging

from django.conf import settings
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import (
    GoogleLoginSerializer,
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
    UserMeSerializer,
)

logger = logging.getLogger(__name__)


def tokens_for(user) -> dict:
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {"user": UserMeSerializer(user).data, **tokens_for(user)},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        return Response({"user": UserMeSerializer(user).data, **tokens_for(user)})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserMeSerializer(request.user).data)


class GoogleLoginView(APIView):
    """
    Sign in (or register) with a Google ID token.

    The frontend gets this token from Google Identity Services and never
    handles a Google password or client secret - it's verified server-side
    against Google's public keys before we trust any of its claims.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not settings.GOOGLE_CLIENT_ID:
            return Response(
                {"detail": "Google sign-in is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            payload = google_id_token.verify_oauth2_token(
                serializer.validated_data["credential"],
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except ValueError as exc:
            logger.warning("Google sign-in rejected: %s", exc)
            return Response(
                {"detail": "Invalid Google credential."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not payload.get("email_verified", False):
            return Response(
                {"detail": "Google account email is not verified."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        email = User.objects.normalize_email(payload["email"]).lower()
        avatar_url = payload.get("picture", "")

        try:
            user = User.objects.get(email__iexact=email)
            created = False
            if avatar_url and user.avatar_url != avatar_url:
                user.avatar_url = avatar_url
                user.save(update_fields=["avatar_url"])
        except User.DoesNotExist:
            user = User(email=email, avatar_url=avatar_url)
            # No password was ever set - this account can only sign in via
            # Google, matching create_user()'s behaviour for password=None.
            user.set_unusable_password()
            user.save()
            created = True

        return Response(
            {"user": UserMeSerializer(user).data, **tokens_for(user)},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class LogoutView(APIView):
    """Blacklist the refresh token so a stolen one cannot be reused after logout."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            RefreshToken(serializer.validated_data["refresh"]).blacklist()
        except TokenError:
            pass

        return Response(status=status.HTTP_205_RESET_CONTENT)
