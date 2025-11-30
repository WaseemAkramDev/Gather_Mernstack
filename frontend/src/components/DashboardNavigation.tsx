import { Calendar, MapPin, Sparkles } from "lucide-react";
import { NavbarTabs, type User } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useUserAvatars } from "../api/avatars";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "./ConfirmationPopup";
import { useState } from "react";
import { useLogout } from "../api/authenticate";

interface DashboardNavigationProps {
  setOpen: (open: boolean) => void;
  selectedTab: NavbarTabs;
  setselectedTab: (tab: NavbarTabs) => void;
}

function DashboardNavigation({
  setOpen,
  selectedTab,
  setselectedTab,
}: DashboardNavigationProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutMutation = useLogout();

  const user: User | undefined = queryClient.getQueryData<User>(["user"]);
  const userIds = user?.userId ? [user.userId] : [];
  const [showLogoutPopup, setshowLogoutPopup] = useState(false);

  const { data } = useUserAvatars(userIds);

  const userAvatar =
    data?.length > 0 &&
    data?.find((avatar: any) => avatar.userId == user?.userId).avatarImageUrl;

  const logoutFunction = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-emerald-900/30 backdrop-blur-md border-b border-slate-600/30 py-6 px-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-3 mr-8">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-400/25">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-2 h-2 bg-white rounded-sm animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-sm animation-delay-100"></div>
                    <div className="w-2 h-2 bg-white rounded-sm animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white rounded-sm animation-delay-300"></div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-sm opacity-60"></div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className={`flex  items-center space-x-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 transform  ${
                  selectedTab === NavbarTabs.EVENTS
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-400/30 shadow-lg shadow-emerald-500/10"
                    : "text-slate-300 "
                }`}
                // onClick={() => setselectedTab(NavbarTabs.EVENTS)}
              >
                <Calendar className="w-5 h-5" />
                <span>Events</span>
                {selectedTab === NavbarTabs.EVENTS && (
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </button>

              <button
                className={`flex cursor-pointer items-center space-x-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  selectedTab === NavbarTabs.MYSPACES
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-400/30 shadow-lg shadow-emerald-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                onClick={() => setselectedTab(NavbarTabs.MYSPACES)}
              >
                <MapPin className="w-5 h-5" />
                <span>My Spaces</span>
                {selectedTab === NavbarTabs.MYSPACES && (
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div
              className="flex items-center space-x-3 cursor-pointer group transition-all duration-200 hover:bg-slate-700/30 px-4 py-2 rounded-xl"
              onClick={() => setOpen(true)}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
                <div className="relative rounded-full border-2 border-transparent bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 p-0.5">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover pb-2 ring-2 ring-white/50 transition-all duration-300 group-hover:ring-emerald-400/50"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full ring-2 ring-white/50 transition-all duration-300 group-hover:ring-emerald-400/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  )}

                  <div className="absolute -bottom-0.5 -right-0.5 transform translate-y-[-2px]">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-60 animate-pulse"></div>
                      <div className="relative w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-white font-semibold group-hover:text-emerald-300 transition-colors">
                  {user?.username || "Guest"}
                </span>
                <span className="text-slate-400 text-xs">
                  Click to change avatar
                </span>
              </div>
            </div>

            <button
              onClick={() => setshowLogoutPopup(true)}
              className="cursor-pointer flex items-center space-x-2 transition-all duration-200 hover:bg-slate-700/50 px-4 py-2 rounded-xl group"
            >
              <span className="text-slate-300 group-hover:text-white font-medium">
                Logout
              </span>
              {/* <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 transition-all duration-200 group-hover:rotate-180" /> */}
            </button>

            <button
              onClick={() => navigate("/create-space")}
              className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center space-x-2 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              <Sparkles className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Create Space</span>
            </button>
          </div>
        </div>
      </nav>
      <ConfirmationPopup
        isOpen={showLogoutPopup}
        onConfirm={logoutFunction}
        onCancel={() => setshowLogoutPopup(false)}
        title="Logout ?"
        message="Are You Sure You Want To Logout."
        variant="danger"
      />
    </>
  );
}

export default DashboardNavigation;
