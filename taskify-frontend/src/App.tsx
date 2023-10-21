import { MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./App.css"
import "@mantine/core/styles.css"

const queryClient = new QueryClient()

function App() {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <div>1</div>
      </QueryClientProvider>
    </MantineProvider>
  )
}

export default App
