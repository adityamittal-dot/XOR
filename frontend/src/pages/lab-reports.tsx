import { useCallback, useEffect, useState } from "react";
import { FileText, RefreshCw, Trash2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { MainLayout } from "../components/main-layout";
import { LabReportUpload } from "../components/lab-report-upload";
import { LabReportChat } from "../components/lab-report-chat";
import { LabAPI, type LabReport, type LabReportStatus } from "../api/lab";

const STATUS_STYLES: Record<LabReportStatus, string> = {
  READY: "bg-green-100 text-green-800",
  PROCESSING: "bg-amber-100 text-amber-800",
  UPLOADED: "bg-slate-100 text-slate-700",
  FAILED: "bg-red-100 text-red-800",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LabReportsPage() {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [selected, setSelected] = useState<LabReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setReports(await LabAPI.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(file: File) {
    const created = await LabAPI.upload(file);
    setReports((prev) => [created, ...prev]);
    setSelected(created);
  }

  async function handleReanalyze(report: LabReport) {
    const updated = await LabAPI.reanalyze(report.id);
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelected((current) => (current?.id === updated.id ? updated : current));
  }

  async function handleDelete(report: LabReport) {
    if (!confirm(`Delete "${report.title || "this report"}"?`)) return;

    await LabAPI.remove(report.id);
    setReports((prev) => prev.filter((r) => r.id !== report.id));
    setSelected((current) => (current?.id === report.id ? null : current));
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lab Reports</h1>
            <p className="text-gray-500">
              Upload a PDF and get a plain-language explanation of your results.
            </p>
          </div>
          <LabReportUpload onUpload={handleUpload} />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {loading ? (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : reports.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-gray-500">
                  No reports yet. Upload your first lab report PDF to get started.
                </CardContent>
              </Card>
            ) : (
              reports.map((report) => (
                <Card
                  key={report.id}
                  onClick={() => setSelected(report)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                    selected?.id === report.id ? "border-2 border-blue-500" : ""
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-blue-100 p-2">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {report.title || `Report #${report.id}`}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(report.uploaded_at)}
                          </p>
                          {report.status === "FAILED" && report.ai_analysis?.error && (
                            <p className="mt-1 text-sm text-red-600">
                              {report.ai_analysis.error}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Badge className={STATUS_STYLES[report.status]}>
                          {report.status}
                        </Badge>
                        {report.status === "FAILED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Retry analysis"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReanalyze(report);
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete report"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(report);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-4">
            {selected ? (
              <>
                <LabAnalysisPanel report={selected} />
                {selected.status === "READY" && (
                  <LabReportChat reportId={selected.id} />
                )}
              </>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed text-slate-400">
                Select a report to see its analysis
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function Section({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-600">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function LabAnalysisPanel({ report }: { report: LabReport }) {
  const analysis = report.ai_analysis;

  if (report.status !== "READY" || !analysis) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-gray-500">
          {report.status === "FAILED"
            ? analysis?.error || "This report could not be analysed."
            : "Analysis in progress..."}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <h3 className="text-lg font-semibold">
            {report.title || "Analysis"}
          </h3>
          {analysis.summary && (
            <p className="mt-1 text-sm text-gray-600">{analysis.summary}</p>
          )}
        </div>

        <Section title="Key findings" items={analysis.key_findings} />

        {!!analysis.abnormal_values?.length && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Values outside range
            </h4>
            <div className="mt-2 space-y-2">
              {analysis.abnormal_values.map((value, i) => (
                <div
                  key={i}
                  className="rounded-md border border-amber-200 bg-amber-50 p-2 text-sm"
                >
                  <span className="font-medium">{value.test}</span>: {value.value}{" "}
                  <span className="text-gray-500">
                    (range {value.reference_range})
                  </span>
                  {value.note && <div className="text-gray-600">{value.note}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <Section title="Questions for your doctor" items={analysis.doctor_questions} />
        <Section title="When to seek help" items={analysis.red_flags_to_seek_help} />

        {analysis.disclaimer && (
          <p className="border-t pt-3 text-xs text-gray-500">{analysis.disclaimer}</p>
        )}
      </CardContent>
    </Card>
  );
}
