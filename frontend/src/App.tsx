import { Route, Routes } from "react-router"
import DashboardPage from "@/features/dashboard/DashboardPage"
import LeadsPage from "@/features/leads/LeadsPage"
import ContactsPage from "@/features/contacts/ContactsPage"
import SettingsPage from "@/features/settings/SettingsPage"
import LoginPage from "@/features/auth/LoginPage"
import AppLayout from "@/components/shared/AppLayout"
import ThemeProvider from "@/components/shared/ThemeProvider"
import LandingPage from "./features/static/LandingPage"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="lambdacrm-theme">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
        <Route path="/leads" element={<AppLayout><LeadsPage /></AppLayout>} />
        <Route path="/contacts" element={<AppLayout><ContactsPage /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App;
