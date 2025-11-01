import { useState } from "react";
import AvatarPopup from "../components/AvatarPopup";
import DashboardNavigation from "../components/DashboardNavigation";
import SpacesCardWrapper from "../components/SpacesCardWrapper";
import { NavbarTabs, SpacePageTabs, type User } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useUserAvatars } from "../api/avatars";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const user: User | undefined = queryClient.getQueryData<User>(["user"]);
  const userIds = user?.userId ? [user.userId] : [];
  const { data: userAvatars } = useUserAvatars(userIds);
  const currentUserHasAvatar = !!userAvatars?.find(
    (avatar: any) => avatar?.userId == user?.userId
  );

  const [selectedTab, setselectedTab] = useState<NavbarTabs>(
    NavbarTabs.MYSPACES
  );
  const [selectedToggle, setselectedToggle] = useState<SpacePageTabs>(
    SpacePageTabs.CREATEDSPACES
  );

  return (
    <div className="min-h-screen bg-[#282d4e]">
      {(open || !currentUserHasAvatar) && <AvatarPopup setOpen={setOpen} />}
      <DashboardNavigation
        setOpen={setOpen}
        selectedTab={selectedTab}
        setselectedTab={setselectedTab}
      />
      <SpacesCardWrapper
        selectedToggle={selectedToggle}
        setselectedToggle={setselectedToggle}
      />
    </div>
  );
};

export default Dashboard;
