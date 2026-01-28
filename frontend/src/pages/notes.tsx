import { useEffect, useState } from "react";
import { NotesAPI, type Note } from "../api/notes";
import NoteForm from "../components/NoteForm";
import Modal from "../components/Modal";

function getErrorMessage(err: unknown) {
  if (typeof err === "string") return err;

  if (err && typeof err === "object") {
    // common DRF / apiFetch error shapes
    const maybeDetail = (err as { detail?: string }).detail;
    if (maybeDetail) return maybeDetail;

    const maybeMessage = (err as { message?: string }).message;
    if (maybeMessage) return maybeMessage;
  }

  return "Something went wrong";
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    NotesAPI.list()
      .then(setNotes)
      .catch((err: unknown) => {
        console.error(err);
        alert("Failed to load notes");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(data: { title: string; content: string }) {
    setCreating(true);
    try {
      const newNote = await NotesAPI.create(data);

      // ✅ instant UI update (no refetch)
      setNotes((prev) => [newNote, ...prev]);

      setCreateOpen(false);
    } catch (err: unknown) {
      console.error(err);
      alert(getErrorMessage(err) || "Failed to create note");
    } finally {
      setCreating(false);
    }
  }

  function openEdit(note: Note) {
    setEditingNote(note);
    setEditOpen(true);
  }

  async function handleUpdate(data: { title: string; content: string }) {
    if (!editingNote) return;

    setUpdating(true);
    try {
      const updated = await NotesAPI.update(editingNote.id, data);

      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));

      setEditOpen(false);
      setEditingNote(null);
    } catch (err: unknown) {
      console.error(err);
      alert(getErrorMessage(err) || "Failed to update note");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(id: number) {
    const ok = confirm("Delete this note?");
    if (!ok) return;

    try {
      await NotesAPI.remove(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err: unknown) {
      console.error(err);
      alert("Failed to delete note");
    }
  }

  if (loading) {
    return <div className="p-6 text-slate-200">Loading notes...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Notes</h2>

          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
          >
            + New Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
            No notes yet. Create your first note ✅
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold">{note.title}</h4>
                    <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openEdit(note)}
                      className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(note.id)}
                      className="rounded-md border border-red-500/50 px-3 py-1 text-sm text-red-300 hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ CREATE MODAL */}
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

        {/* ✅ EDIT MODAL */}
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
    </div>
  );
}
