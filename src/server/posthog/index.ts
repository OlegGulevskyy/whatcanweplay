import { PostHog } from "posthog-node";
import { env } from "~/env.mjs";

export const posthogClient = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: env.NEXT_PUBLIC_POSTHOG_HOST,
});

// On program exit, call shutdown to stop pending pollers and flush any remaining events
await posthogClient.shutdown();
