import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { getIp } from "~/utils/ip";
import { getRateLimiter } from "~/lib/rate-limit";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import { postDiscordMessage } from "~/lib/discord";

const rateLimiter = getRateLimiter({ allowReqs: 1, perSeconds: 30 });

export const discordRouter = createTRPCRouter({
  sendDiscordMessage: privateProcedure
    .input(
      z.object({
        message: z.string(),
        user: z.string(),
        channel: z.enum(["messages", "payments"]).optional(),
      }),
    )
    .use(async ({ ctx, next }) => {
      if (env.NODE_ENV !== "production") {
        return next();
      }

      const { user } = ctx;
      if (!user.email) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You need to be logged in to send messages",
        });
      }

      const identifier = getIp() ?? user.email;
      const result = await rateLimiter.limit(identifier);
      ctx.headers.set("X-RateLimit-Limit", `${result.limit}`);
      ctx.headers.set("X-RateLimit-Remaining", `${result.remaining}`);

      if (!result.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message:
            "You are sending too many requests. Please try again later (in 30 seconds).",
        });
      }
      return next();
    })
    .mutation(async ({ input }) => {
      const url =
        input.channel === "payments"
          ? env.DISCORD_WEBHOOK_URL
          : env.DISCORD_WEBHOOK_URL_MESSAGES;

      return postDiscordMessage({ ...input, channelUrl: url });
    }),
});
