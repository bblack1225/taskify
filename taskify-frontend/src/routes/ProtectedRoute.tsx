import MainLayout from "@/components/layout/MainLayout";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? true : false;

  return (
    <>
      {isAuthenticated ? (
        <MainLayout />
      ) : (
        <Navigate replace to={"/login"} state={{ from: location }} />
      )}
    </>
  );
};
