import "./App.scss";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/layout/MainLayout";
import TaskBoard from "./pages/Taskboard";
import { Notifications } from "@mantine/notifications";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications style={{ bottom: "50px" }} zIndex={1000} />
        <MainLayout>
          <TaskBoard />
        </MainLayout>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
