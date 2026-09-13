import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

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
        <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Doctor follow-up"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Content</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          rows={5}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || !title.trim()}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
