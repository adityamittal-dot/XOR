import { apiFetch } from "./client";

export type Note = {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

export const NotesAPI = {
  list(): Promise<Note[]> {
    return apiFetch("/api/notes/");
  },

  create(data: { title: string; content: string }): Promise<Note> {
    return apiFetch("/api/notes/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(
    id: number,
    data: Partial<{ title: string; content: string }>
  ): Promise<Note> {
    return apiFetch(`/api/notes/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Django usually returns 204 No Content on delete, so return Promise<null>
  remove(id: number): Promise<null> {
    return apiFetch(`/api/notes/${id}/`, {
      method: "DELETE",
    });
  },
};
