"""
Gemini-backed analysis and chat for lab reports.

The client is created lazily so the project still imports, migrates and runs
its test suite when no GEMINI_API_KEY is configured.
"""

import json
import logging

from django.conf import settings
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

_client: genai.Client | None = None


class GeminiUnavailable(RuntimeError):
    """Raised when Gemini is not configured or the call could not complete."""


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY:
            raise GeminiUnavailable("GEMINI_API_KEY is not configured.")
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


SAFETY_RULES = """
STRICT SAFETY RULES (must follow):
1) Do NOT diagnose.
2) Do NOT claim certainty or final medical conclusions.
3) Do NOT prescribe medication or dosages.
4) Only use information present in the report text.
5) If something is missing, write: "Not found in report".
6) Keep the wording polite, supportive, and easy to understand.
7) Always remind the reader to confirm with their own clinician.
"""

ANALYSIS_SCHEMA = """
{
  "title_guess": "string",
  "summary": "string",
  "key_findings": ["string"],
  "abnormal_values": [
    {
      "test": "string",
      "value": "string",
      "reference_range": "string",
      "note": "string"
    }
  ],
  "normal_values_highlights": ["string"],
  "possible_discussion_points": ["string"],
  "doctor_questions": ["string"],
  "lifestyle_support_tips": ["string"],
  "red_flags_to_seek_help": ["string"],
  "disclaimer": "string"
}
"""

# Keeps a very long report inside the model's context window.
MAX_REPORT_CHARS = 50_000


def _safe_json_load(text: str) -> dict:
    """Parse JSON from a model response, tolerating stray prose or code fences."""
    text = (text or "").strip()
    if not text:
        raise ValueError("Gemini returned an empty response.")

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end > start:
        try:
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            pass

    raise ValueError("Gemini did not return valid JSON.")


def _generate(prompt: str, *, as_json: bool) -> str:
    """Call Gemini and return the raw text, normalising every failure mode."""
    client = _get_client()
    config = types.GenerateContentConfig(
        response_mime_type="application/json" if as_json else "text/plain"
    )

    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=config,
        )
    except Exception as exc:  # the SDK surfaces many transport/API error types
        logger.exception("Gemini request failed")
        raise GeminiUnavailable(str(exc)) from exc

    text = getattr(response, "text", None)
    if not text:
        raise GeminiUnavailable("Gemini returned no usable content.")
    return text


def analyze_lab_report(extracted_text: str) -> dict:
    """Return a structured, patient-friendly analysis of a lab report."""
    if not extracted_text or not extracted_text.strip():
        raise ValueError("Cannot analyse an empty lab report.")

    prompt = f"""
You are a polite, careful medical report assistant for a health dashboard.

Your job:
- Read the LAB REPORT TEXT provided by the user.
- Extract useful information.
- Provide a clear and friendly summary.
- Suggest doctor follow-up questions for the next visit.
{SAFETY_RULES}
Output must be valid JSON only, matching exactly these keys:
{ANALYSIS_SCHEMA}

STYLE GUIDE:
- Summary: short, polite, reassuring tone.
- Key Findings: bullet-like statements.
- Abnormal Values: only list values clearly outside their reference range.
- Doctor Questions: practical questions a patient can ask.
- Red Flags: general, safe symptoms that may need urgent attention.
- Disclaimer: always state this is not medical advice.

LAB REPORT TEXT:
\"\"\"{extracted_text[:MAX_REPORT_CHARS]}\"\"\"
"""

    return _safe_json_load(_generate(prompt, as_json=True))


def _format_history(history: list) -> str:
    """Render prior turns for the prompt, ignoring malformed entries."""
    return "\n".join(
        f"{turn.get('role', 'user').upper()}: {turn.get('content', '')}"
        for turn in history
        if isinstance(turn, dict) and turn.get("content")
    )


def chat_about_lab_report(
    extracted_text: str,
    analysis: dict | None,
    history: list,
    question: str,
) -> str:
    """Answer a follow-up question grounded in one report. Returns plain prose."""
    if not question or not question.strip():
        raise ValueError("A question is required.")

    conversation = _format_history(history)
    summary = json.dumps(analysis, indent=2)[:5_000] if analysis else ""

    prompt = f"""
You are a polite medical report assistant. Answer the patient's question using
only the lab report below and the earlier analysis.
{SAFETY_RULES}
FORMATTING:
- Plain text only. No markdown, asterisks, hashes or backticks.
- Short paragraphs and simple bullet lines.
- Start with a brief friendly greeting.
- End by reminding them to confirm with their healthcare provider.

=== LAB REPORT TEXT ===
{extracted_text[:MAX_REPORT_CHARS]}
=== END REPORT ===

=== EARLIER ANALYSIS (JSON) ===
{summary or "Not available."}
=== END ANALYSIS ===

=== RECENT CONVERSATION ===
{conversation or "No earlier messages."}
=== END CONVERSATION ===

PATIENT'S QUESTION:
{question}
"""

    return _generate(prompt, as_json=False).strip()


def chat_general_health(
    question: str,
    history: list,
    reports_context: str = "",
) -> str:
    """
    Answer a general health question.

    Unlike chat_about_lab_report this is not tied to one document, so it is
    given short summaries of the user's analysed reports as background and is
    told to fall back to general information when they do not cover the question.
    """
    if not question or not question.strip():
        raise ValueError("A question is required.")

    prompt = f"""
You are a polite, careful health assistant in a personal health dashboard.
Answer the user's question clearly and in simple language.
{SAFETY_RULES}
USING THE BACKGROUND:
- The user's own report summaries may appear below. Prefer them when the
  question is about the user's own results, and cite the values you rely on.
- If the background does not cover the question, answer with general health
  information and say plainly that it is general, not based on their reports.
- Never invent a value that is not in the background.

FORMATTING:
- Plain text only. No markdown, asterisks, hashes or backticks.
- Short paragraphs and simple bullet lines.
- End by reminding them to confirm with their healthcare provider.

=== THE USER'S REPORT SUMMARIES ===
{reports_context or "This user has no analysed reports yet."}
=== END SUMMARIES ===

=== RECENT CONVERSATION ===
{_format_history(history) or "No earlier messages."}
=== END CONVERSATION ===

USER'S QUESTION:
{question}
"""

    return _generate(prompt, as_json=False).strip()
