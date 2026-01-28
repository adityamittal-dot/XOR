import { useState } from "react";

type NoteFormProps = {
  initialTitle?: string;
  initialContent?: string;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (data: { title: string; content: string }) => void | Promise<void>;
  onCancel?: () => void;
};

export default function NoteForm({
  initialTitle = "",
  initialContent = "",
  submitLabel,
  loading = false,
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title: title.trim(), content: content.trim() });
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm text-slate-300 mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Doctor follow-up"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          rows={5}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
