import LoginPage from "@/pages/LoginPage";
import {
  Navigate,
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
} from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import TaskBoard from "@/pages/Taskboard";
import CalendarPage from "@/pages/CalendarPage";
import { TaskCardModal } from "@/pages/TaskCardModal";

export const AppRoute = () => {
  const location = useLocation();
  console.log("location.state", location);

  const background = location.state && location.state.background;
  console.log("background", background);

  return (
    <>
      <Routes location={background || location}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate replace to={"/board"} />} />
          <Route path="/board" element={<TaskBoard />}>
            <Route path="/board/card/:taskId" element={<TaskCardModal />} />
          </Route>
          <Route path="/calendar" element={<CalendarPage />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="/board/card/:taskId" element={<TaskCardModal />} />
        </Routes>
      )}
    </>
  );
};

// export const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/" element={<ProtectedRoute />}>
//         <Route path="/" element={<Navigate replace to={"/board"} />} />
//         <Route path="/board" element={<TaskBoard />}>
//           <Route path="/board/modal" element={<TaskCardModal />} />
//         </Route>
//         <Route path="/calendar" element={<CalendarPage />} />
//       </Route>
//     </>
//   )
// );
