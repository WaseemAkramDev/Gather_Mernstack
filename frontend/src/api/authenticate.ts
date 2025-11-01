import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from ".";
import type { SignupResponse, SigninResponse } from "../types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const signup = async (
  username: string,
  password: string
): Promise<SignupResponse> => {
  const { data } = await api.post("/signup", { username, password });
  return data;
};

export const signin = async (
  username: string,
  password: string
): Promise<SigninResponse> => {
  const { data } = await api.post("/signin", { username, password });
  return data;
};

export function useSignin() {
  const queryClient = useQueryClient();
  return useMutation<
    SigninResponse,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => signin(username, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["authToken"], data.token);
      localStorage.setItem("token", data.token);
      toast.success("Logged in!");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      navigate("/");
      queryClient.setQueryData(["authToken"], null);
      localStorage.removeItem("token");
      queryClient.clear();
      toast.success("Logged out successfully!");
    },
  });
}
