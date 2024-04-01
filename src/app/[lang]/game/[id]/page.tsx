import { redirect } from "next/navigation";

import { LOGIN_ROUTE_PATH } from "~/constants/navigation";
import { api } from "~/trpc/server";
import { getServerUser } from "~/utils/auth";

export const metadata = {
  title: "WhatCanWePlay - Game Page",
  description: "Generated game details and rules",
};

const GamePage = async ({ params }: { params: { id: string } }) => {
  const { user } = await getServerUser();

  if (!user) {
    // TODO: fix redirecting back to the game page after login
    // Right now it's garbage
    redirect(LOGIN_ROUTE_PATH);
  }

  // const serverApi = api.game.create.mutate({});

  return (
    <div>
      <h1>Game Page</h1>
    </div>
  );
};

export default GamePage;
