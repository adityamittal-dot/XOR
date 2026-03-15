import { MainLayout } from "../components/main-layout";
import { LabReportUpload } from "../components/lab-report-upload";
import { LabReportChat } from "../components/lab-report-chat";
import { LabGeminiPanel } from "../components/lab-gemini-panel";

import { Card } from "../components/ui/card";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back 👋 Choose Notes from the sidebar to open your notes.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload */}
          <Card className="p-4">
            <LabReportUpload />
          </Card>

          {/* Gemini Panel */}
          <Card className="p-4">
            <LabGeminiPanel />
          </Card>

          {/* Chat */}
          <Card className="p-4 lg:col-span-2">
            <LabReportChat reportId="some-id" fileName="report.pdf"/>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
