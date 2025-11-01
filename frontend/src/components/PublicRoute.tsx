import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const PublicRoute = () => {
  const { data: token } = useQuery({
    queryKey: ["authToken"],
    queryFn: () => localStorage.getItem("token"),
    initialData: () => localStorage.getItem("token"),
  });

  if (token) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
