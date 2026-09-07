from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Note

User = get_user_model()


class NoteApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="owner@example.com", password="s3cure-pass-42"
        )
        self.other = User.objects.create_user(
            email="other@example.com", password="s3cure-pass-42"
        )
        self.client.force_authenticate(user=self.user)

    def test_requires_authentication(self):
        self.client.force_authenticate(user=None)

        self.assertEqual(
            self.client.get("/api/notes/").status_code, status.HTTP_401_UNAUTHORIZED
        )

    def test_create_assigns_current_user(self):
        response = self.client.post(
            "/api/notes/", {"title": "Checkup", "content": "Fasting glucose"}
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.get(pk=response.data["id"]).user, self.user)

    def test_list_excludes_other_users_notes(self):
        Note.objects.create(user=self.other, title="Private", content="secret")
        Note.objects.create(user=self.user, title="Mine", content="visible")

        response = self.client.get("/api/notes/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([note["title"] for note in response.data], ["Mine"])

    def test_cannot_read_another_users_note(self):
        note = Note.objects.create(user=self.other, title="Private", content="secret")

        response = self.client.get(f"/api/notes/{note.pk}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cannot_reassign_note_owner(self):
        response = self.client.post(
            "/api/notes/",
            {"title": "Mine", "content": "body", "user": self.other.pk},
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.get(pk=response.data["id"]).user, self.user)

    def test_delete_own_note(self):
        note = Note.objects.create(user=self.user, title="Temp", content="body")

        response = self.client.delete(f"/api/notes/{note.pk}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Note.objects.filter(pk=note.pk).exists())
