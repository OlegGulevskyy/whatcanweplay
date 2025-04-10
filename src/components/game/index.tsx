"use client";

import { api } from "~/trpc/react";
import { type TGame } from "~/types/db.types";
import { LoadingScreen } from "~/components/Loading";
import { clientSupabase } from "~/server/supabase/supabaseClient";
import { useEffect, useRef } from "react";
import { type RealtimeChannel } from "@supabase/supabase-js";
import { LoadedGame } from "./loaded-game";

export const GameDetailsView = (props: Pick<TGame, "id">) => {
  const {
    data: gameData,
    isLoading: isGameLoading,
    refetch,
  } = api.game.getGameById.useQuery({ id: props.id });

  const channel = useRef<RealtimeChannel | null>(null);

  const handleGameUpdate = async (payload: unknown) => {
    refetch();
  };

  const subscribeToGameUpdates = async () => {
    channel.current = clientSupabase
      .channel("games-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games" },
        (payload) => {
          refetch();
        },
      )
      .subscribe();

    console.log("%cSubscribed to game updates", "color: green");
    console.log("Subscriber: ", channel.current);
  };

  useEffect(() => {
    subscribeToGameUpdates();
    return () => {
      channel.current?.unsubscribe();
    };
  }, []);

  if (isGameLoading) {
    return <LoadingScreen />;
  }

  if (!gameData) {
    return <div>Game not found</div>;
  }

  if (gameData?.gen_status === "pending") {
    return (
      <div className="mt-20">
        <div>We are working on generating your game...</div>
        <div>Please wait</div>
      </div>
    );
  }

  if (gameData?.gen_status === "success") {
    return <LoadedGame {...gameData} />;
  }

  if (gameData?.gen_status === "failure") {
    return (
      <div>
        <p>Something went wrong while generating your game</p>
        <p>Please try again later</p>
      </div>
    );
  }
};
