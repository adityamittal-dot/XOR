<<<<<<< HEAD
import React, { useState } from "react";
=======
import { useState } from "react";
>>>>>>> origin/frontend
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

<<<<<<< HEAD
/**
 * UI-only AI lab analysis panel.
 * This component simulates AI output and is ready
 * to be wired to a DRF + Gemini backend later.
 */
=======
>>>>>>> origin/frontend
export function LabGeminiPanel() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;

<<<<<<< HEAD
    setAnalysis(
      "This is a demo AI analysis.\n\n" +
        "In a production environment, this input would be sent to a backend " +
        "service (Django REST Framework) which would securely call an AI model " +
        "like Google Gemini.\n\n" +
        "The analysis would include:\n" +
        "- Overall health summary\n" +
        "- Explanation of abnormal values\n" +
        "- Suggested follow-up questions for your clinician"
=======
    // ✅ DEMO RESPONSE — replace with Gemini API later
    setAnalysis(
      `This is a demo AI analysis.

In production, this panel will:
• Summarize your lab report
• Explain abnormal values in simple language
• Suggest questions to discuss with your doctor

Example insights:
- Hemoglobin is slightly low → may indicate mild anemia
- Elevated WBC → could suggest infection or inflammation
`
>>>>>>> origin/frontend
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <CardTitle>AI Lab Report Assistant</CardTitle>
        </div>
        <CardDescription>
<<<<<<< HEAD
          Paste your lab values and get a patient-friendly explanation powered by
          AI.
=======
          Paste your lab values and get a patient-friendly explanation powered by AI.
>>>>>>> origin/frontend
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Paste your lab results here, for example:
<<<<<<< HEAD
Hemoglobin: 11.2 g/dL (13.0 - 17.0)
WBC: 12.5 x10^9/L (4.0 - 11.0)
...`}
=======

Hemoglobin: 11.2 g/dL (13.0 – 17.0)
WBC: 12.5 x10⁹/L (4.0 – 11.0)
Platelets: 220 x10⁹/L (150 – 450)
`}
>>>>>>> origin/frontend
          rows={6}
        />

        <div className="flex justify-end">
          <Button onClick={handleAnalyze} disabled={!input.trim()}>
            Analyze with AI
          </Button>
        </div>

        {analysis && (
<<<<<<< HEAD
          <div className="mt-4 border rounded-md p-3 text-sm whitespace-pre-wrap bg-muted/40">
=======
          <div className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
>>>>>>> origin/frontend
            {analysis}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
