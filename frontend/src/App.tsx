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
