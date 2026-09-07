import { apiFetch } from "./client";
import type { ChatTurn } from "./lab";

export const AssistantAPI = {
  /** General health chat, grounded in the user's own analysed reports. */
  chat(message: string, history: ChatTurn[]) {
    return apiFetch<{ reply: string }>("/api/assistant/chat/", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    });
  },
};
