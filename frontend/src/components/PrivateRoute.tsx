import { Navigate, Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import type { User } from "../types";

const PrivateRoute = () => {
  const queryClient = useQueryClient();
  const token = queryClient.getQueryData<string>(["authToken"]);
  const user: User | undefined = queryClient.getQueryData<User>(["user"]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!user && token) {
    try {
      const decoded = jwtDecode<User>(token);
      queryClient.setQueryData(["user"], decoded);
    } catch (e) {
      console.error("Invalid token:", e);
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
