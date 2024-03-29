import type { PropsWithChildren } from "react";

export const metadata = {
  title: "Izeat - Messages",
  description: "User messages page",
};

const MessagesLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default MessagesLayout;
