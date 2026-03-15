import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login";
import NotesPage from "./pages/notes";
import DashboardPage from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LabReportsPage from "./pages/lab-reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Default route should go to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lab-reports"
          element={
            <ProtectedRoute>
              <LabReportsPage />
            </ProtectedRoute>
        }
      />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
