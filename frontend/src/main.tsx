import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import App from "./App"
import Notes from "./pages/notes"
import LabReports from "./pages/lab-reports"
import Chatbot from "./pages/chatbot"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Notes />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/lab-reports" element={<LabReports />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
