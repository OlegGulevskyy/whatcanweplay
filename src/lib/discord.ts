import { env } from "~/env.mjs";

export const postDiscordMessage = async ({
  message,
  user,
  channelUrl,
}: {
  message: string;
  user?: string;
  channelUrl?: string;
}) => {
  const userName = user ? user : "**SYSTEM**";

  const response = await fetch(channelUrl ?? env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: message, username: userName }),
  });

  if (!response.ok) {
    console.error("Failed to post message to Discord");
  }
};
