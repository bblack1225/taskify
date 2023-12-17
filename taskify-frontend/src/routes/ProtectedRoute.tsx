import MainLayout from "@/components/layout/MainLayout";
import { LabelsProvider } from "@/context/LabelsProvider";
import { UserProvider } from "@/context/UserContext";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? true : false;

  return (
    <>
      {isAuthenticated ? (
        <UserProvider>
          <LabelsProvider >
            <MainLayout />
          </LabelsProvider>
        </UserProvider>
      ) : (
        <Navigate replace to={"/login"} state={{ from: location }} />
      )}
    </>
  );
};
