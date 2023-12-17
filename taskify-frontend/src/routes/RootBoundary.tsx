import NotFoundPage from "@/pages/not-found/NotFoundPage";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RootBoundary() {
  const error = useRouteError();

  if(isRouteErrorResponse(error)){
    if(error.status === 404){
        return <NotFoundPage />
    }
  }
}