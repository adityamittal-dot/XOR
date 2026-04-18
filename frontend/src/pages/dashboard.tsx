import React, { useState } from "react";
import { MainLayout } from "../components/main-layout";
import { LabReportChat } from "../components/lab-report-chat";
import { Card, CardContent } from "../components/ui/card";

export default function Dashboard() {

  const [selectedReport, setSelectedReport] = useState<{ id: number; name: string } | null>(null);

  const reports = [
    { id: 1, name: "Full Blood Count" },
    { id: 2, name: "Lipid Profile" },
  ];

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Your Reports</h2>
          {reports.map((report) => (
            <Card 
              key={report.id} 
              className={`cursor-pointer transition-border ${selectedReport?.id === report.id ? 'border-blue-500 border-2' : ''}`}
              onClick={() => setSelectedReport(report)}
            >
              <CardContent className="p-4">
                {report.name}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">AI Chat Analysis</h2>
          {selectedReport ? (

            <LabReportChat reportId={selectedReport.id.toString()} />
          ) : (
            <div className="h-100 flex items-center justify-center border-2 border-dashed rounded-xl text-slate-400">
              Select a report to start chatting
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}