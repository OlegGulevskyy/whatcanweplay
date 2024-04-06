import { createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "./routers/profile";
import { gameRouter } from "./routers/game";
import { discordRouter } from "./routers/discord";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  game: gameRouter,
  discord: discordRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
