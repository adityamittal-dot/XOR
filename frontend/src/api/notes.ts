import { apiFetch } from "./client";

export const NotesAPI = {
  list() {
    return apiFetch("/api/notes/");
  },

  create(data: { title: string; content: string }) {
    return apiFetch("/api/notes/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: Partial<{ title: string; content: string }>) {
    return apiFetch(`/api/notes/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  remove(id: number) {
    return apiFetch(`/api/notes/${id}/`, {
      method: "DELETE",
    });
  },
};
