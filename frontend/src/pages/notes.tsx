import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { NotesAPI, type Note } from "../api/notes";
import NoteForm from "../components/NoteForm";
import Modal from "../components/Modal";
import { MainLayout } from "../components/main-layout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    NotesAPI.list()
      .then(setNotes)
      .catch((err) => setError(errorMessage(err, "Failed to load notes.")))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(data: { title: string; content: string }) {
    setCreating(true);
    setError(null);
    try {
      const created = await NotesAPI.create(data);
      setNotes((prev) => [created, ...prev]);
      setCreateOpen(false);
    } catch (err) {
      setError(errorMessage(err, "Failed to create note."));
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(data: { title: string; content: string }) {
    if (!editingNote) return;

    setUpdating(true);
    setError(null);
    try {
      const updated = await NotesAPI.update(editingNote.id, data);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setEditOpen(false);
      setEditingNote(null);
    } catch (err) {
      setError(errorMessage(err, "Failed to update note."));
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this note?")) return;

    try {
      await NotesAPI.remove(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(errorMessage(err, "Failed to delete note."));
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
            <p className="text-gray-500">
              Keep symptoms, questions and reminders alongside your reports.
            </p>
          </div>

          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : notes.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-500">
              No notes yet. Create your first note to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold">{note.title}</h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                        {note.content}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingNote(note);
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(note.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Modal
          title="Create Note"
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        >
          <NoteForm
            submitLabel="Create"
            loading={creating}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
          />
        </Modal>

        <Modal
          title="Edit Note"
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditingNote(null);
          }}
        >
          {editingNote && (
            <NoteForm
              initialTitle={editingNote.title}
              initialContent={editingNote.content}
              submitLabel="Update"
              loading={updating}
              onSubmit={handleUpdate}
              onCancel={() => {
                setEditOpen(false);
                setEditingNote(null);
              }}
            />
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
