import { Outlet } from "react-router-dom"
import { ConditionalLayout } from "@/components/conditional-layout"

/**
 * App.tsx
 * This replaces Next.js layout.tsx in XOR (Vite + React)
 */
export default function App() {
  return (
    <div className="antialiased">
      <ConditionalLayout>
        <Outlet />
      </ConditionalLayout>
    </div>
  )
}
