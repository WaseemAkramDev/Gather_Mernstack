import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from ".";
import type { Avatar } from "../types";
import toast from "react-hot-toast";

const getAvatarsList = async (): Promise<any> => {
  const { data } = await api.get("/avatars");
  return data;
};

export function useAvatars() {
  return useQuery<Avatar[]>({
    queryKey: ["avatars"],
    queryFn: getAvatarsList,
  });
}

const createAvatarMetadata = async ({
  userId,
  avatarImageUrl,
  avatarName,
}: {
  userId: string;
  avatarImageUrl: string;
  avatarName: string;
}) => {
  const { data } = await api.post("/user/metadata", {
    userId,
    avatarImageUrl,
    avatarName,
  });
  return data;
};

export function useCreateMetaData() {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    { userId: string; avatarImageUrl: string; avatarName: string }
  >({
    mutationFn: createAvatarMetadata,
    onSuccess: () => {
      toast.success("Avatar updated!");
      queryClient.invalidateQueries({
        queryKey: ["userAvatars"],
      });
    },
  });
}

const getUserAvatar = async (userIds: string[]): Promise<any> => {
  const { data } = await api.post("/user/metadata/by-users", { userIds });
  return data;
};

export function useUserAvatars(userIds: string[]) {
  return useQuery<any, Error>({
    queryKey: ["userAvatars", userIds],
    queryFn: () => getUserAvatar(userIds),
    enabled: userIds.length > 0,
  });
}

const updateAvatarMetadata = async ({
  userId,
  avatarImageUrl,
  avatarName,
}: {
  userId: string;
  avatarImageUrl: string;
  avatarName: string;
}) => {
  const { data } = await api.put(`/user/${userId}`, {
    avatarImageUrl,
    avatarName,
  });
  return data;
};

export function useUpdateMetaData() {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    { userId: string; avatarImageUrl: string; avatarName: string }
  >({
    mutationFn: updateAvatarMetadata,
    onSuccess: () => {
      toast.success("Avatar updated!");
      queryClient.invalidateQueries({
        queryKey: ["userAvatars"],
      });
    },
  });
}
