import LoginPage from "@/pages/LoginPage";
import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import TaskBoard from "@/pages/Taskboard";
import CalendarPage from "@/pages/CalendarPage";
import RootBoundary from "./RootBoundary";
import AllBoard from "@/pages/AllBoard";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={<ProtectedRoute />}
        errorElement={<RootBoundary />}
      >
        <Route path="/" element={<Navigate replace to={"/allBoards"} />} />
        <Route path="/allBoards" element={<AllBoard />} />
        <Route path="/board/:boardId" element={<TaskBoard />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Route>
    </>
  )
);
