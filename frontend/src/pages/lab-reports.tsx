import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FileText, Download, Eye, Plus } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { MainLayout } from "../components/main-layout";

const reports = [
  { id: 1, name: "Blood Work - Comprehensive", date: "2026-03-10", status: "Complete", type: "Hematology" },
  { id: 2, name: "Lipid Panel", date: "2026-02-15", status: "Complete", type: "Biochemistry" },
  { id: 3, name: "Urinalysis", date: "2026-01-20", status: "Pending", type: "Analysis" },
];

export default function LabReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lab Reports</h1>
            <p className="text-muted-foreground">View and manage your recent laboratory results.</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Upload Report
          </Button>
        </div>

        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:bg-slate-50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{report.name}</h3>
                      <div className="flex gap-2 text-sm text-gray-500">
                        <span>{report.date}</span>
                        <span>•</span>
                        <span>{report.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>
                      {report.status}
                    </Badge>
                    <Button>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}