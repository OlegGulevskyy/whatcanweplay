import { type PropsWithChildren } from "react";
import { PublicRoute } from "~/components/public-route/public-route";

const Layout = async ({ children }: PropsWithChildren) => {
  return <PublicRoute>{children}</PublicRoute>;
};

export default Layout;
