import { useQuery } from "@tanstack/react-query";
import api from ".";

const getMaps = async (): Promise<any> => {
  const { data } = await api.get("/user/maps");
  return data;
};

export function useMaps() {
  return useQuery<any[]>({
    queryKey: ["maps"],
    queryFn: getMaps,
  });
}

const getElements = async (): Promise<any> => {
  const { data } = await api.get("/user/elements");
  return data;
};

export function useElements() {
  return useQuery<any[]>({
    queryKey: ["elements"],
    queryFn: getElements,
  });
}
