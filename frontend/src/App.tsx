<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { ConditionalLayout } from "@/components/conditional-layout";

function App() {
  return (
    <ConditionalLayout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </ConditionalLayout>
  );
}

export default App;
=======
import { MainLayout } from "./components/main-layout";

export default function App() {
  return (
    <MainLayout>
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">
          Dashboard Content
        </h1>
        <p className="mt-2 text-gray-600">
          Main layout is working correctly.
        </p>
      </div>
    </MainLayout>
  );
}
>>>>>>> origin/frontend
