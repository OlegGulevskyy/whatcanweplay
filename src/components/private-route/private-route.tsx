import { type PropsWithChildren } from "react";
import { getServerUser } from "~/utils/auth";
import { PrivateRouteBase } from "./private-route-base";
import { redirect } from "next/navigation";

export const PrivateRoute = async ({ children }: PropsWithChildren) => {
  const user = await getServerUser();

  if (!user) redirect("/login");

  return <PrivateRouteBase>{children}</PrivateRouteBase>;
};
