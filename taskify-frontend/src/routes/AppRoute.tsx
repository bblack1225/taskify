import LoginPage from "@/pages/LoginPage";
import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import TaskBoard from "@/pages/Taskboard";
import CalendarPage from "@/pages/CalendarPage";

function RootBoundary() {
  const error = useRouteError();
  console.log("error", error);
  console.log("typeof error", typeof error);

  if (isRouteErrorResponse(error))
    if (error.status === 401) {
      return <div>401</div>;
    }
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={<ProtectedRoute />}
        errorElement={<RootBoundary />}
      >
        <Route path="/" element={<Navigate replace to={"/board"} />} />
        <Route path="/board" element={<TaskBoard />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Route>
    </>
  )
);
