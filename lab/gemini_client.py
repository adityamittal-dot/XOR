import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def _safe_json_load(text: str) -> dict:
  text = text.strip()
  
  if text.startswith("{") and text.endswith("}"):
    try:
      return json.loads(text)
    except json.JSONDecodeError:
      return {}
    
  start = text.find("{")
  end = text.rfind("}")
    
  if start != -1 and end != -1 and end > start:
    try:
      return json.loads(text[start:end+1])
    except json.JSONDecodeError:
      return {}
    
  raise ValueError("Gemini did not return valid JSON.")

def analyze_lab_report_with_gemini(extracted_text: str) -> dict:
    """
    Generates a structured + polite + safe lab report analysis.
    Output is JSON so your frontend can render it cleanly.
    """

    prompt = f"""
You are a polite, careful medical report assistant for a health dashboard.

Your job:
- Read the LAB REPORT TEXT provided by the user.
- Extract useful information.
- Provide a clear and friendly summary.
- Suggest doctor follow-up questions for the next visit.

STRICT SAFETY RULES (must follow):
1) Do NOT diagnose.
2) Do NOT claim certainty or final medical conclusions.
3) Do NOT prescribe medication.
4) Only use information present in the report text.
5) If something is missing, write: "Not found in report".
6) Keep the wording polite, supportive, and easy to understand.
7) Output must be valid JSON ONLY (no markdown, no extra text).

OUTPUT JSON FORMAT (exact keys required):
{{
  "title_guess": "string",
  "summary": "string",
  "key_findings": ["string"],
  "abnormal_values": [
    {{
      "test": "string",
      "value": "string",
      "reference_range": "string",
      "note": "string"
    }}
  ],
  "normal_values_highlights": ["string"],
  "possible_discussion_points": ["string"],
  "doctor_questions": ["string"],
  "lifestyle_support_tips": ["string"],
  "red_flags_to_seek_help": ["string"],
  "disclaimer": "string"
}}

STYLE GUIDE:
- Summary: short, polite, reassuring tone.
- Key Findings: bullet-like statements.
- Abnormal Values: only list values clearly outside range (if present).
- Doctor Questions: practical questions a patient can ask.
- Red Flags: symptoms that may require urgent medical attention (general, safe).
- Disclaimer: always mention this is not medical advice.

LAB REPORT TEXT:
\"\"\"{extracted_text}\"\"\"
"""

    model = genai.GenerativeModel("gemini-1.5-flash")
    res = model.generate_content(prompt)

    return _safe_json_load(res.text) 