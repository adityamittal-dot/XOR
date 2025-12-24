import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Trash2,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GmailConnector } from "@/components/gmail-connector"
import { LabReportUpload } from "@/components/lab-report-upload"
import { LabGeminiPanel } from "@/components/lab-gemini-panel"
import { LabReportChat } from "@/components/lab-report-chat"

/* =========================
   Types (backend-ready)
   ========================= */
export interface LabReport {
  id: string
  file_name: string
  raw_text: string
  structured_data?: {
    testType?: string
    date?: string
    testResults?: Array<{
      name: string
      value: string
      unit?: string
      referenceRange?: string
      status?: "normal" | "high" | "low" | "critical"
    }>
  }
  ai_analysis?: string
  uploaded_at: string
}

export default function LabReports() {
  const [labReports, setLabReports] = useState<LabReport[]>([])
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null)

  const handleDelete = (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return

    setLabReports((prev) => prev.filter((r) => r.id !== reportId))
    if (selectedReport?.id === reportId) {
      setSelectedReport(null)
    }
  }

  /* =========================
     Stats
     ========================= */
  const totalReports = labReports.length
  const normalReports = labReports.filter((r) => {
    const results = r.structured_data?.testResults || []
    return results.every((t) => t.status === "normal" || !t.status)
  }).length
  const abnormalReports = totalReports - normalReports
  const criticalReports = labReports.filter((r) =>
    r.structured_data?.testResults?.some((t) => t.status === "critical")
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Lab Report Analysis
          </h2>
          <p className="text-muted-foreground">
            Upload and analyze your lab test results with AI-powered insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GmailConnector />
          <LabReportUpload />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Recent Reports</TabsTrigger>
          <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
        </TabsList>

        {/* ================= OVERVIEW ================= */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Reports" value={totalReports}>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </StatCard>

            <StatCard title="Normal Results" value={normalReports}>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </StatCard>

            <StatCard title="Abnormal Results" value={abnormalReports}>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </StatCard>

            <StatCard title="Critical Alerts" value={criticalReports}>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </StatCard>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>No Reports Yet</CardTitle>
              <CardDescription>
                Upload your first lab report to get AI-powered analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <LabGeminiPanel />
        </TabsContent>

        {/* ================= REPORTS ================= */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Recent Lab Reports</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {labReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No lab reports uploaded yet</p>
                </div>
              ) : (
                labReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {report.structured_data?.testType ||
                          report.file_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        className="border px-3 py-1"
                        onClick={() => setSelectedReport(report)}
                      >
                        View
                      </Button>
                      <Button
                        className="border px-3 py-1"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= ANALYSIS ================= */}
        <TabsContent value="analysis">
          {selectedReport ? (
            <LabReportChat
              reportId={selectedReport.id}
              fileName={selectedReport.file_name}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Select a report to view details</CardTitle>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* =========================
   Helper component
   ========================= */
function StatCard({
  title,
  value,
  children,
}: {
  title: string
  value: number
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
