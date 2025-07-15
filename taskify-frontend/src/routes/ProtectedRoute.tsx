import MainLayout from "@/components/layout/MainLayout";
import { LabelsProvider } from "@/context/LabelsProvider";
import { UserProvider } from "@/context/UserContext";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? true : false;

  const pathSegments = location.pathname.split("/");
  const boardId =
    pathSegments[1] === "board" && pathSegments[2] ? pathSegments[2] : null;

  return (
    <>
      {isAuthenticated ? (
        <UserProvider>
          {boardId ? (
            <LabelsProvider boardId={boardId}>
              <MainLayout />
            </LabelsProvider>
          ) : (
            <MainLayout />
          )}
        </UserProvider>
      ) : (
        <Navigate replace to={"/login"} state={{ from: location }} />
      )}
    </>
  );
};
