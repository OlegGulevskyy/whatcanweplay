"use server";

import { env } from "~/env.mjs";
import { postDiscordMessage } from "~/lib/discord";

// Send a message to a discord channel through server action to not expose the webhook url
export const sendDiscordMessageServer = ({
  message,
  user,
  channel,
}: {
  message: string;
  user?: string;
  channel?: "messages" | "payments";
}) => {
  const url =
    channel === "payments"
      ? env.DISCORD_WEBHOOK_URL
      : env.DISCORD_WEBHOOK_URL_MESSAGES;
  return postDiscordMessage({ message, user, channelUrl: url });
};
