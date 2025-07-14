import DashboardPage from "@/pages/DashboardPage"
import { ThemeProvider } from "./components/shared/theme-provider"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="lambdacrm-theme">
      <DashboardPage />
    </ThemeProvider>
  )
}

export default App
