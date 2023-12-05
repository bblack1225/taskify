import "./App.scss";
import "@mantine/core/styles.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  RootRoute,
  Navigate,
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

// test auth
const isAuthenicated: boolean = true;
const rootRoute = new RootRoute({
  component: () => {
    if (!isAuthenicated) {
      return (
        <>
          <Navigate to="/login" />
          <Outlet />
        </>
      );
    }
    return (
      <>
        <Navigate to="/taskify/board" />
        <Outlet />
      </>
    );
  },
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => {
    return <LoginPage />;
  },
});

const BOARD_ID = "296a0423-d062-43d7-ad2c-b5be1012af96";
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/taskify/board",
  component: () => {
    return (
      <>
        <LabelsProvider boardId={BOARD_ID}>
          <MainLayout>
            <TaskBoard />
          </MainLayout>
        </LabelsProvider>
      </>
    );
  },
});
export const routeTree = rootRoute.addChildren([indexRoute, loginRoute]);
const router = new Router({ routeTree });

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <Notifications
            style={{ bottom: "40px", width: "15rem" }}
            zIndex={1000}
          />
          <RouterProvider router={router} />
        </MantineProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
}
