import "./App.scss";
import "@mantine/core/styles.css";
import { Button, MantineProvider, Text, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ContextModalProps, ModalsProvider } from "@mantine/modals";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoute, router } from "./routes/AppRoute";
const queryClient = new QueryClient();

//為了讓tag的checkbox的cursor可以pointer
const theme = createTheme({
  cursorType: "pointer",
});

const TestModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ modalBody: string }>) => (
  <>
    <Text size="sm">{innerProps.modalBody}</Text>
    <Button fullWidth mt="md" onClick={() => context.closeModal(id)}>
      X
    </Button>
  </>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <ModalsProvider modals={{ demonstration: TestModal }}>
          <Notifications
            style={{ bottom: "40px", width: "15rem" }}
            zIndex={1000}
          />
          {/* <RouterProvider router={router}  /> */}
          <BrowserRouter>
            <AppRoute />
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
