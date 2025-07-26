import { Route, Routes } from "react-router"
import DashboardPage from "@/features/dashboard/DashboardPage"
import LeadsPage from "@/features/leads/LeadsPage"
import ContactsPage from "@/features/contacts/ContactsPage"
import SettingsPage from "@/features/settings/SettingsPage"
import LoginPage from "@/features/auth/components/LoginPage"
import AppLayout from "@/components/shared/AppLayout"
import ThemeProvider from "@/components/shared/ThemeProvider"
import LandingPage from "@/features/static/LandingPage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { type AuthContextValueType } from "./types/core"
import AuthContext from "@/components/shared/AuthContext"
import SignUpPage from "@/features/auth/components/SignUpPage"
import { Toaster } from "sonner"
import ConfirmUserPage from "@/features/auth/components/ConfirmUserPage"

const queryClient = new QueryClient();

function App() {
  const [auth, setAuth] = useState<AuthContextValueType>({ isAuthenticated: false, user: null });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="lambdacrm-theme">
      <AuthContext.Provider value={{ auth: auth, setAuth: setAuth}}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
        <Toaster />
      </AuthContext.Provider>
    </ThemeProvider>
  )
}

export default App;
