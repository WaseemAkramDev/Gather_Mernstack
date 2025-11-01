import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useAvatars,
  useCreateMetaData,
  useUpdateMetaData,
  useUserAvatars,
} from "../api/avatars";
import type { Avatar, User } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AvatarPopupProps {
  setOpen: (open: boolean) => void;
}

export default function AvatarPopup({ setOpen }: AvatarPopupProps) {
  const queryClient = useQueryClient();
  const user: User | undefined = queryClient.getQueryData<User>(["user"]);

  const { mutate: createMeta } = useCreateMetaData();
  const { mutate: updateMeta } = useUpdateMetaData();

  const { data: avatars, isLoading, error, isError } = useAvatars();

  const userIds = user?.userId ? [user.userId] : [];

  const { data: userAvatars } = useUserAvatars(userIds);

  const [index, setIndex] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

  const handleNext = () => {
    if (avatars && avatars.length > 0) {
      setIndex((prev) => (prev + 1) % avatars.length);
    }
  };

  const handlePrev = () => {
    if (avatars && avatars.length > 0) {
      setIndex((prev) => (prev - 1 + avatars.length) % avatars.length);
    }
  };

  const handleSelectAvatar = () => {
    if (avatars && avatars[index]) {
      setSelectedAvatar(avatars[index]);
    }
  };

  const onAvatarSelect = () => {
    if (!user || !selectedAvatar || !userAvatars) return;
    if (userAvatars.find((avatar: any) => avatar.userId == user.userId)) {
      updateMeta({
        userId: user.userId,
        avatarImageUrl: selectedAvatar.imageUrl,
        avatarName: selectedAvatar.name,
      });
      return;
    }
    createMeta({
      userId: user.userId,
      avatarImageUrl: selectedAvatar.imageUrl,
      avatarName: selectedAvatar.name,
    });
  };

  const handleConfirm = () => {
    if (selectedAvatar) {
      onAvatarSelect();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (avatars && avatars.length > 0 && !selectedAvatar) {
      setSelectedAvatar(avatars[0]);
    }
  }, [avatars, selectedAvatar]);

  useEffect(() => {
    handleSelectAvatar();
  }, [index, avatars]);

  const currentAvatar: Avatar | undefined = avatars?.[index];
  const isSelected = selectedAvatar?._id === currentAvatar?._id;

  const currentUserHasAvatar = !!userAvatars?.find(
    (avatar: any) => avatar?.userId == user?.userId
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl w-[420px] p-8 flex justify-center border border-slate-700">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-slate-300 font-medium">Loading avatars...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    console.log(error);
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-3xl shadow-2xl w-[420px] p-8 text-center border border-red-700">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-white" />
            </div>
            <p className="text-red-100 text-lg font-medium">
              Failed to load avatars
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!avatars || avatars.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl w-[420px] p-8 text-center border border-slate-700">
          <div className="mb-6">
            <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-slate-400 rounded-full"></div>
            </div>
            <p className="text-slate-300 text-lg font-medium">
              No avatars available
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!currentAvatar) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-3xl shadow-2xl w-[420px] p-8 relative flex flex-col items-center border border-slate-600/50">
        <button
          onClick={() => {
            if (currentUserHasAvatar) {
              setOpen(false);
              return;
            }
            toast.error("must Choose an Avatar!");
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-slate-700"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Choose Your Avatar
          </h2>
          <p className="text-slate-400 mt-2">
            Select the perfect representation of you
          </p>
        </div>
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-slate-700/50 hover:bg-slate-600 transition-all duration-200 transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={avatars.length <= 1}
          >
            <ChevronLeft className="w-6 h-6 text-emerald-400" />
          </button>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div
              onClick={handleSelectAvatar}
              className={`relative rounded-full cursor-pointer border-4 transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? "border-emerald-400 shadow-lg shadow-emerald-400/50"
                  : "border-slate-600 hover:border-slate-500"
              }`}
            >
              <img
                src={currentAvatar.imageUrl}
                alt={currentAvatar.name || "avatar"}
                className="w-32 h-32 rounded-full object-cover"
              />
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-slate-700/50 hover:bg-slate-600 transition-all duration-200 transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={avatars.length <= 1}
          >
            <ChevronRight className="w-6 h-6 text-emerald-400" />
          </button>
        </div>
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-white mb-2 capitalize">
            {currentAvatar.name}
          </h3>
          <p className="text-slate-400 text-sm">
            {index + 1} of {avatars.length} avatars
          </p>
        </div>
        {avatars.length > 1 && (
          <div className="flex gap-2 mb-6">
            {avatars.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === index
                    ? "bg-emerald-400 w-6"
                    : "bg-slate-600 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>
        )}
        <button
          onClick={handleConfirm}
          disabled={!selectedAvatar}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] ${
            selectedAvatar
              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          }`}
        >
          {selectedAvatar ? "Confirm Selection" : "Select an Avatar"}
        </button>
      </div>
    </div>
  );
}
