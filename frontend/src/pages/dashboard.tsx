import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, StickyNote } from "lucide-react";
import { MainLayout } from "../components/main-layout";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../context/authContext";
import { LabAPI, type LabReport } from "../api/lab";
import { NotesAPI, type Note } from "../api/notes";

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      LabAPI.list().catch(() => [] as LabReport[]),
      NotesAPI.list().catch(() => [] as Note[]),
    ])
      .then(([labReports, userNotes]) => {
        setReports(labReports);
        setNotes(userNotes);
      })
      .finally(() => setLoading(false));
  }, []);

  const readyCount = reports.filter((r) => r.status === "READY").length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </h1>
          <p className="text-gray-500">
            Your lab reports and health notes in one place.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Lab reports" value={reports.length} />
            <StatCard label="Analysed" value={readyCount} />
            <StatCard label="Notes" value={notes.length} />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <PanelCard
            to="/lab-reports"
            icon={<FileText className="h-5 w-5 text-blue-600" />}
            title="Recent lab reports"
            emptyText="No reports yet. Upload a PDF to get started."
            items={reports.slice(0, 5).map((r) => ({
              id: r.id,
              primary: r.title || `Report #${r.id}`,
              secondary: r.status,
            }))}
          />

          <PanelCard
            to="/notes"
            icon={<StickyNote className="h-5 w-5 text-blue-600" />}
            title="Recent notes"
            emptyText="No notes yet."
            items={notes.slice(0, 5).map((n) => ({
              id: n.id,
              primary: n.title,
              secondary: "",
            }))}
          />
        </div>
      </div>
    </MainLayout>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-1 text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

type PanelItem = { id: number; primary: string; secondary: string };

function PanelCard({
  to,
  icon,
  title,
  items,
  emptyText,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  items: PanelItem[];
  emptyText: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="font-semibold">{title}</h2>
          </div>
          <Link to={to} className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">{emptyText}</p>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="truncate">{item.primary}</span>
                {item.secondary && (
                  <span className="ml-3 shrink-0 text-xs text-gray-500">
                    {item.secondary}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
