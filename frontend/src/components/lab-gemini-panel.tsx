import { useState } from "react";
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

export function LabGeminiPanel() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;

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
          Paste your lab values and get a patient-friendly explanation powered by AI.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Paste your lab results here, for example:

Hemoglobin: 11.2 g/dL (13.0 – 17.0)
WBC: 12.5 x10⁹/L (4.0 – 11.0)
Platelets: 220 x10⁹/L (150 – 450)
`}
          rows={6}
        />

        <div className="flex justify-end">
          <Button onClick={handleAnalyze} disabled={!input.trim()}>
            Analyze with AI
          </Button>
        </div>

        {analysis && (
          <div className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
            {analysis}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
