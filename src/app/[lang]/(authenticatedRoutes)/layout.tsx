import { type PropsWithChildren } from "react";
import { PrefetchTRPCQuery } from "~/components/prefetch-trpc-query/prefetch-trpc-query";
import { PrivateRoute } from "~/components/private-route/private-route";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <PrivateRoute>
      <PrefetchTRPCQuery queryName="profile.get">{children}</PrefetchTRPCQuery>
    </PrivateRoute>
  );
}
