import { apiFetch } from "./client";

export type LabReportStatus = "UPLOADED" | "PROCESSING" | "READY" | "FAILED";

export type AbnormalValue = {
  test: string;
  value: string;
  reference_range: string;
  note: string;
};

export type LabAnalysis = {
  title_guess?: string;
  summary?: string;
  key_findings?: string[];
  abnormal_values?: AbnormalValue[];
  normal_values_highlights?: string[];
  possible_discussion_points?: string[];
  doctor_questions?: string[];
  lifestyle_support_tips?: string[];
  red_flags_to_seek_help?: string[];
  disclaimer?: string;
  error?: string;
};

export type LabReport = {
  id: number;
  title: string;
  file: string;
  status: LabReportStatus;
  extracted_text?: string;
  ai_analysis: LabAnalysis | null;
  uploaded_at: string;
  updated_at: string;
};

export type ChatTurn = { role: "user" | "assistant"; content: string };

export const LabAPI = {
  list() {
    return apiFetch<LabReport[]>("/api/lab-reports/");
  },

  get(id: number) {
    return apiFetch<LabReport>(`/api/lab-reports/${id}/`);
  },

  upload(file: File, title?: string) {
    const body = new FormData();
    body.append("file", file);
    if (title) body.append("title", title);

    return apiFetch<LabReport>("/api/lab-reports/", { method: "POST", body });
  },

  remove(id: number) {
    return apiFetch<null>(`/api/lab-reports/${id}/`, { method: "DELETE" });
  },

  reanalyze(id: number) {
    return apiFetch<LabReport>(`/api/lab-reports/${id}/reanalyze/`, {
      method: "POST",
    });
  },

  chat(id: number, message: string, history: ChatTurn[]) {
    return apiFetch<{ reply: string }>(`/api/lab-reports/${id}/chat/`, {
      method: "POST",
      body: JSON.stringify({ message, history }),
    });
  },
};
