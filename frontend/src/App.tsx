import DashboardPage from "@/features/dashboard/DashboardPage";
import LeadsPage from "@/features/leads/components/LeadsPage";
import ContactsPage from "@/features/contacts/components/ContactsPage";
import SettingsPage from "@/features/settings/SettingsPage";
import LoginPage from "@/features/auth/components/LoginPage";
import AppLayout from "@/components/shared/AppLayout";
import ThemeProvider from "@/components/shared/ThemeProvider";
import SignUpPage from "@/features/auth/components/SignUpPage";
import ConfirmUserPage from "@/features/auth/components/ConfirmUserPage";
import AuthContextProvider from "@/features/auth/components/AuthContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router";
import { Toaster } from "sonner";
import AppPage from "./features/web/components/OrganizationsPage";
import HomePage from "./features/web/components/HomePage";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="lambdacrm-theme">
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/app/organizations/:organizationId/dashboard"
              element={
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              }
            />
            <Route
              path="/app/organizations/:organizationId/leads"
              element={
                <AppLayout>
                  <LeadsPage />
                </AppLayout>
              }
            />
            <Route
              path="/app/organizations/:organizationId/contacts"
              element={
                <AppLayout>
                  <ContactsPage />
                </AppLayout>
              }
            />
            <Route
              path="/app/organizations/:organizationIdsettings"
              element={
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              }
            />
            <Route path="/app/organizations/" element={<AppPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signup/confirm" element={<ConfirmUserPage />} />
          </Routes>
        </AuthContextProvider>
      </QueryClientProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
