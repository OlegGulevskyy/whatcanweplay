import type { PropsWithChildren } from "react";

export const metadata = {
  title: "Izeat - Profile",
  description: "Profile settings page",
};

const ProfileSettingsLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default ProfileSettingsLayout;
