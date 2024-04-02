import { experimental_generateText } from "ai";
import { z } from "zod";

import { GenerateGameSchema } from "~/components/play/form-schema";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { getOpenAiClient } from "~/utils/openai";

const NewGameSchema = z.object({
  title: z.string().optional(),
  purpose: z.string().optional(),
  setup: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  howToWin: z.string().optional(),
  howToPlay: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const openai = getOpenAiClient();

const buildPrompt = ({
  location,
  amountOfPlayers,
  minimumAge,
  duration,
  props,
  customInstructions,
}: z.infer<typeof GenerateGameSchema>) => {
  let prompt = `Generate a game for ${amountOfPlayers} players that is ${duration} minutes long. Design the game be played in a ${location}.`;

  if (minimumAge) {
    prompt += ` The game should be suitable for players over the age of ${minimumAge}.`;
  }

  if (props) {
    prompt += ` The game should include the following props: ${props}.`;
  }

  if (customInstructions) {
    prompt += ` ${customInstructions}`;
  }

  return prompt;
};

export const gameRouter = createTRPCRouter({
  generate: privateProcedure
    .input(
      z.object({
        location: z.string().min(3).max(30),
        amountOfPlayers: z.coerce.number().int().min(1).max(10),
        duration: z.coerce.number().int().min(1).max(60),
        minimumAge: z.coerce.number().int().min(1).max(100),
        customInstructions: z.string().max(50).optional(),
        props: z.string().max(30).optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      const { user } = ctx;
      const prompt = buildPrompt(input);
      console.log("user :: ", user.email, "prompt :: ", prompt);

      return experimental_generateText({
        model: openai.chat("gpt-4-0125-preview"),
        tools: {
          game: {
            description:
              "Generate a fun, innovative game for a group of people.",
            parameters: z.object({
              title: z.string().describe("The title of the game"),
              purpose: z.string().describe("The purpose of the game"),
              setup: z.array(z.string()).describe("The setup of the game"),
              rules: z.array(z.string()).describe("The rules of the game"),
              howToWin: z.string().describe("How to win the game"),
              howToPlay: z.string().describe("How to play the game"),
              additionalInfo: z.string().optional().describe("Additional info"),
            }),
          },
        },
        prompt,
      });
    }),
  create: privateProcedure
    .input(GenerateGameSchema)
    .mutation(async ({ ctx, input }) => {
      const { user, db } = ctx;
      const result = await db
        .from("games")
        .insert({ created_by: user.id })
        .select("id")
        .single();

      if (result.error) {
        console.log("user :: " + ctx.user.email + "failed to create game id");
        console.error(result.error);
        throw new Error("Failed to create a game");
      }

      const savedPrompt = await db
        .from("prompts")
        .insert({
          game: result.data.id,
          location: input.location,
          amount_of_players: input.amountOfPlayers,
          duration: input.duration,
          minimum_age: input.minimumAge,
          custom_instructions: input.customInstructions,
          props: input.props,
        })
        .select()
        .single();

      if (savedPrompt.error) {
        console.log("user :: " + ctx.user.email + "failed to save prompt");
        console.error(savedPrompt.error);
        throw new Error("Failed to save prompt");
      }

      // TODO replace bu proper logging or Posthog
      console.log(
        "user :: " +
          ctx.user.email +
          "created a game with id :: " +
          result.data.id,
      );
      console.log(
        "user :: " +
          ctx.user.email +
          "saved a prompt with id :: " +
          savedPrompt.data.id,
      );

      return { id: result.data.id };
    }),
});