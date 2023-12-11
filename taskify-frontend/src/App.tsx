import "./App.scss";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoute";
const queryClient = new QueryClient();

//為了讓tag的checkbox的cursor可以pointer
const theme = createTheme({
  cursorType: "pointer",
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications
          style={{ bottom: "40px", width: "15rem" }}
          zIndex={1000}
        />
        {/* <RouterProvider router={router}  /> */}
        <RouterProvider router={router} />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
