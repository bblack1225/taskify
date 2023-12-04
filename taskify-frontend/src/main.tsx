import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  RootRoute,
} from "@tanstack/react-router";
import LoginPage from "./pages/LoginPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { LabelsProvider } from "./context/LabelsProvider.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";
import TaskBoard from "./pages/Taskboard.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

//為了讓tag的checkbox的cursor可以pointer
const theme = createTheme({
  cursorType: "pointer",
});

const rootRoute = new RootRoute({
  component: () => (
    <>
      <LoginPage />
      <Outlet />
    </>
  ),
});

const BOARD_ID = "296a0423-d062-43d7-ad2c-b5be1012af96";
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/taskify/board",
  component: function App() {
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
  },
});

const routeTree = rootRoute.addChildren([indexRoute]);
const router = new Router({ routeTree });
console.log("router", router);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
