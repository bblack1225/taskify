import "./App.css"
import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import MainLayout from "./components/layout/MainLayout"
import TaskBoard from "./pages/Taskboard"

const queryClient = new QueryClient()

function App() {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <MainLayout>
          <TaskBoard />
        </MainLayout>
      </QueryClientProvider>
    </MantineProvider>
  )
}

export default App
