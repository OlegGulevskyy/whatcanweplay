import type { PropsWithChildren } from "react";

export const metadata = {
  title: "Create your own game!",
  description: "What Can We Play? - Create your own game!",
};

const PlayPageLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default PlayPageLayout;
