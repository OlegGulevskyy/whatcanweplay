import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { env } from "~/env.mjs";

const redis = new Redis({
  url: env.UPSTASH_REDIS_URL,
  token: env.UPSTASH_REDIS_TOKEN,
});

// Create a new ratelimiter, that allows 1 request per 30 seconds
export const getRateLimiter = ({
  allowReqs,
  perSeconds,
}: {
  allowReqs: number;
  perSeconds: number;
}) =>
  new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(allowReqs, `${perSeconds} s`),
  });

//
// export default async function handler(req, res) {
// // // Use a constant string to limit all requests with a single ratelimit
// // // Or use a userID, apiKey or ip address for individual limits.
// //   const identifier = "api";
// //   const result = await ratelimit.limit(identifier);
// //   res.setHeader('X-RateLimit-Limit', result.limit)
// //   res.setHeader('X-RateLimit-Remaining', result.remaining)
// //
// //   if (!result.success) {
// //     res.status(200).json({message: 'The request has been rate limited.', rateLimitState: result})
// //     return
// //   }
// //
// //   res.status(200).json({name: 'John Doe', rateLimitState: result})
// }
