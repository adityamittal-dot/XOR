from django.contrib.auth import get_user_model
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
