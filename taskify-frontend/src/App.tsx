import "./App.scss";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/layout/MainLayout";
import TaskBoard from "./pages/Taskboard";
import { Notifications } from "@mantine/notifications";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LabelsProvider } from "@/context/LabelsContext";

const queryClient = new QueryClient();

//為了讓tag的checkbox的cursor可以pointer
const theme = createTheme({
  cursorType: "pointer",
});

const BOARD_ID = "296a0423-d062-43d7-ad2c-b5be1012af96";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications
          style={{ bottom: "40px", width: "15rem" }}
          zIndex={1000}
        />
        <LabelsProvider boardId={BOARD_ID}>
          <MainLayout>
            <TaskBoard />
          </MainLayout>
        </LabelsProvider>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
