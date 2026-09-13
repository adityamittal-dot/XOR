from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class RegisterTests(APITestCase):
    url = "/api/auth/register/"

    def test_register_returns_tokens(self):
        response = self.client.post(
            self.url, {"email": "new@example.com", "password": "s3cure-pass-42"}
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertTrue(User.objects.filter(email="new@example.com").exists())

    def test_weak_password_is_rejected(self):
        response = self.client.post(
            self.url, {"email": "a@example.com", "password": "123"}
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email="a@example.com").exists())

    def test_duplicate_email_is_rejected(self):
        User.objects.create_user(email="dupe@example.com", password="s3cure-pass-42")

        response = self.client.post(
            self.url, {"email": "dupe@example.com", "password": "s3cure-pass-42"}
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com", password="s3cure-pass-42"
        )

    def test_login_succeeds(self):
        response = self.client.post(
            "/api/auth/login/",
            {"email": "user@example.com", "password": "s3cure-pass-42"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_login_with_bad_password_fails(self):
        response = self.client.post(
            "/api/auth/login/", {"email": "user@example.com", "password": "wrong"}
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_me_requires_authentication(self):
        self.assertEqual(
            self.client.get("/api/auth/me/").status_code, status.HTTP_401_UNAUTHORIZED
        )

    def test_me_returns_current_user(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "user@example.com")


class LogoutTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com", password="s3cure-pass-42"
        )

    def test_logout_blacklists_refresh_token(self):
        login = self.client.post(
            "/api/auth/login/",
            {"email": "user@example.com", "password": "s3cure-pass-42"},
        )
        refresh = login.data["refresh"]

        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/auth/logout/", {"refresh": refresh})
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

        retry = self.client.post("/api/auth/refresh/", {"refresh": refresh})
        self.assertEqual(retry.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_requires_authentication(self):
        response = self.client.post("/api/auth/logout/", {"refresh": "anything"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_with_invalid_token_still_succeeds(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/auth/logout/", {"refresh": "not-a-real-token"})
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)


@override_settings(GOOGLE_CLIENT_ID="test-client-id")
class GoogleLoginTests(APITestCase):
    url = "/api/auth/google/"

    @patch("accounts.views.google_id_token.verify_oauth2_token")
    def test_creates_a_new_account_from_a_verified_token(self, verify):
        verify.return_value = {
            "email": "new@example.com",
            "email_verified": True,
            "picture": "https://example.com/photo.jpg",
        }

        response = self.client.post(self.url, {"credential": "fake-jwt"})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        user = User.objects.get(email="new@example.com")
        self.assertEqual(user.avatar_url, "https://example.com/photo.jpg")
        self.assertFalse(user.has_usable_password())

    @patch("accounts.views.google_id_token.verify_oauth2_token")
    def test_signs_in_an_existing_account_by_email(self, verify):
        User.objects.create_user(email="existing@example.com", password="s3cure-pass-42")
        verify.return_value = {
            "email": "existing@example.com",
            "email_verified": True,
            "picture": "https://example.com/new-photo.jpg",
        }

        response = self.client.post(self.url, {"credential": "fake-jwt"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.get(email="existing@example.com")
        self.assertEqual(user.avatar_url, "https://example.com/new-photo.jpg")

    @patch("accounts.views.google_id_token.verify_oauth2_token")
    def test_rejects_an_unverified_email(self, verify):
        verify.return_value = {"email": "new@example.com", "email_verified": False}

        response = self.client.post(self.url, {"credential": "fake-jwt"})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(User.objects.exists())

    @patch("accounts.views.google_id_token.verify_oauth2_token", side_effect=ValueError("bad token"))
    def test_rejects_an_invalid_token(self, _verify):
        response = self.client.post(self.url, {"credential": "not-a-real-jwt"})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @override_settings(GOOGLE_CLIENT_ID="")
    def test_returns_503_when_not_configured(self):
        response = self.client.post(self.url, {"credential": "fake-jwt"})

        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)

    def test_requires_a_credential(self):
        response = self.client.post(self.url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserModelTests(APITestCase):
    def test_create_superuser(self):
        admin = User.objects.create_superuser(
            email="admin@example.com", password="s3cure-pass-42"
        )

        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_email_is_required(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="s3cure-pass-42")
