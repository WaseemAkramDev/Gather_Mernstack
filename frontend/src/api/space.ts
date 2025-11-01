import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from ".";
import toast from "react-hot-toast";

const createSpaceAsync = async ({
  name,
  dimensions,
  mapId,
  thumbnail,
}: {
  name: string;
  dimensions: string;
  mapId: string;
  thumbnail: string;
}) => {
  const { data } = await api.post("/space", {
    name,
    dimensions,
    mapId,
    thumbnail,
  });
  return data;
};

export function useCreateSpace() {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    { name: string; dimensions: string; mapId: string; thumbnail: string }
  >({
    mutationFn: createSpaceAsync,
    onSuccess: () => {
      toast.success("Space Created!");
      queryClient.invalidateQueries({
        queryKey: ["space"],
      });
    },
  });
}

const getSpaceAync = async (): Promise<any> => {
  const { data } = await api.get("/space/all");
  return data?.spaces;
};

export function useSpace() {
  return useQuery<any[]>({
    queryKey: ["space"],
    queryFn: getSpaceAync,
  });
}

const getSpaceDetails = async (spaceId: string): Promise<any> => {
  const { data } = await api.get(`/space/${spaceId}`);
  return data;
};

export function useSpaceDetails(spaceId: string) {
  return useQuery<any, Error>({
    queryKey: ["spaceDetails", spaceId],
    queryFn: () => getSpaceDetails(spaceId),
    enabled: !!spaceId,
  });
}

const addSpaceElement = async ({
  spaceId,
  elementId,
  x,
  y,
}: {
  spaceId: string;
  elementId: string;
  x: number;
  y: number;
}) => {
  const data = await api.post("/space/element", {
    spaceId,
    elementId,
    x,
    y,
  });
  return data;
};

export function useAddElementToSpace() {
  return useMutation<
    any,
    Error,
    { spaceId: string; elementId: string; x: number; y: number }
  >({
    mutationFn: addSpaceElement,
    onSuccess: () => {
      toast.success("Element Added To the Space!");
    },
    onError: () => {
      toast.error("Error While Adding Element To the Space!");
    },
  });
}

const deleteSpaceElement = async ({
  spaceId,
  elementPlacementId,
}: {
  spaceId: String;
  elementPlacementId: String;
}) => {
  const data = await api.delete(
    `/space/element/${spaceId}/${elementPlacementId}`
  );
  return data;
};

export function useDeleteElementFromSpace() {
  return useMutation<
    any,
    Error,
    { spaceId: String; elementPlacementId: String }
  >({
    mutationFn: deleteSpaceElement,
    onSuccess: () => {
      toast.success("Element Deleted From the Space!");
    },
    onError: () => {
      toast.error("Error While Deleting Element From the Space!");
    },
  });
}
