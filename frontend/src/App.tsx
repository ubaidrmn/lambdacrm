import DashboardPage from "@/features/dashboard/DashboardPage"
import LeadsPage from "@/features/leads/LeadsPage"
import ContactsPage from "@/features/contacts/ContactsPage"
import SettingsPage from "@/features/settings/SettingsPage"
import LoginPage from "@/features/auth/components/LoginPage"
import AppLayout from "@/components/shared/AppLayout"
import ThemeProvider from "@/components/shared/ThemeProvider"
import LandingPage from "@/features/static/LandingPage"
import SignUpPage from "@/features/auth/components/SignUpPage"
import ConfirmUserPage from "@/features/auth/components/ConfirmUserPage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Route, Routes } from "react-router"
import { Toaster } from "sonner"
import AuthContextProvider from "./components/shared/AuthContextProvider"

const queryClient = new QueryClient();

function App() {


  return (
    <ThemeProvider defaultTheme="dark" storageKey="lambdacrm-theme">
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
              <Route path="/leads" element={<AppLayout><LeadsPage /></AppLayout>} />
              <Route path="/contacts" element={<AppLayout><ContactsPage /></AppLayout>} />
              <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signup/confirm" element={<ConfirmUserPage />} />
            </Routes>
          </AuthContextProvider>
        </QueryClientProvider>
        <Toaster />
    </ThemeProvider>
  )
}

export default App;
