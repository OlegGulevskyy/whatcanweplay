import type { PropsWithChildren } from "react";

export const metadata = {
  title: "Izeat - Profile",
  description: "User profile page",
};

const ProfileLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default ProfileLayout;
