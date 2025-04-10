import { redirect } from "next/navigation";
import { GameDetailsView } from "~/components/game";

import { LOGIN_ROUTE_PATH } from "~/constants/navigation";
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
    return redirect(LOGIN_ROUTE_PATH);
  }

  return <GameDetailsView id={params.id} />;
};

export default GamePage;
