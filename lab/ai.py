def generate_dummy_analysis(extracted_text: str) -> dict:
    return {
        "summary": "This is a demo summary generated after extracting PDF text.",
        "key_findings": [
            "Hemoglobin appears low in the sample report",
            "MCV is slightly low suggesting microcytic pattern",
        ],
        "abnormal_values": [
            {
                "test": "Hemoglobin (Hb)",
                "value": "11.2 g/dL",
                "reference_range": "13.0 - 17.0",
                "note": "Low",
            }
        ],
        "possible_discussion_points": [
            "Consider iron deficiency evaluation",
            "Clinical correlation with symptoms",
        ],
        "safe_advice": [
            "Do not self-medicate without doctor advice",
            "Maintain balanced diet and hydration",
        ],
        "doctor_questions": [
            "Should I get serum ferritin and iron profile tests?",
            "Do I need iron supplements or only diet changes?",
            "When should I repeat CBC?",
        ],
        "urgency_flags": [
            "Severe weakness",
            "Breathlessness",
            "Chest pain",
        ],
    }
