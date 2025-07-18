import DashboardPage from "@/features/dashboard/DashboardPage"
import { ThemeProvider } from "./components/shared/ThemeProvider"
import { Route, Routes } from "react-router"
import { AppLayout } from "./components/shared/AppLayout/AppLayout"
import LeadsPage from "./features/leads/LeadsPage"
import ContactsPage from "./features/contacts/ContactsPage"
import SettingsPage from "./features/settings/SettingsPage"
import LoginPage from "./features/auth/LoginPage"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="lambdacrm-theme">
      <Routes>
        <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
        <Route path="/leads" element={<AppLayout><LeadsPage /></AppLayout>} />
        <Route path="/contacts" element={<AppLayout><ContactsPage /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
