import { Sidebar, MobileSidebar } from "./components/ui/sidebar";

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar>
        <nav className="space-y-2">
          <a className="block p-2 rounded hover:bg-gray-100">Dashboard</a>
          <a className="block p-2 rounded hover:bg-gray-100">Patients</a>
          <a className="block p-2 rounded hover:bg-gray-100">Reports</a>
          <a className="block p-2 rounded hover:bg-gray-100">Settings</a>
        </nav>
      </Sidebar>

      <main className="flex-1 p-6">
        <MobileSidebar>
          <nav className="space-y-2">
            <a className="block p-2 rounded hover:bg-gray-100">Dashboard</a>
            <a className="block p-2 rounded hover:bg-gray-100">Patients</a>
            <a className="block p-2 rounded hover:bg-gray-100">Reports</a>
            <a className="block p-2 rounded hover:bg-gray-100">Settings</a>
          </nav>
        </MobileSidebar>

        <h1 className="text-xl font-semibold">Main Content</h1>
      </main>
    </div>
  );
}
