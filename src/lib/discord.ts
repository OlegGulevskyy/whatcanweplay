import { env } from "~/env.mjs";

export const postDiscordMessage = async (
  message: string,
  userName?: string,
) => {
  const user = userName ? `**${userName}**` : "**SYSTEM**";

  const response = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: message, username: user }),
  });

  if (!response.ok) {
    console.error("Failed to post message to Discord");
  }
};
