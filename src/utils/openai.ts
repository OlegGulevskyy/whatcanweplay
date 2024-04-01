import { OpenAI } from "ai/openai";
import { env } from "~/env.mjs";

export const getOpenAiClient = () =>
  new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
