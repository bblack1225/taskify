import MainLayout from "@/components/layout/MainLayout";
import { LabelsProvider } from "@/context/LabelsProvider";
import { UserProvider } from "@/context/UserContext";
import { Navigate, useLocation } from "react-router-dom";

const BOARD_ID = "296a0423-d062-43d7-ad2c-b5be1012af96";
export const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? true : false;

  return (
    <>
      {isAuthenticated ? (
        <UserProvider>
          <LabelsProvider boardId={BOARD_ID}>
            <MainLayout />
          </LabelsProvider>
        </UserProvider>
      ) : (
        <Navigate replace to={"/login"} state={{ from: location }} />
      )}
    </>
  );
};
