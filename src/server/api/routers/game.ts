import { TRPCError } from "@trpc/server";
import { experimental_generateText } from "ai";
import { z } from "zod";

import { GenerateGameSchema } from "~/components/play/form-schema";
import { PREMIUM_STATUS } from "~/constants/billing";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { posthogClient } from "~/server/posthog";
import { getOpenAiClient } from "~/utils/openai";
import { getGenerateGamePrompt } from "~/utils/prompts/generate-game";

const openai = getOpenAiClient();

const functionCallingParams = z.object({
  title: z.string().describe("The title of the game"),
  purpose: z.string().describe("The purpose of the game"),
  setup: z.array(z.string()).describe("The setup of the game"),
  rules: z.array(z.string()).describe("The rules of the game"),
  howToWin: z.string().describe("How to win the game"),
  howToPlay: z.string().describe("How to play the game"),
  additionalInfo: z.string().optional().describe("Additional info"),
});

export const gameRouter = createTRPCRouter({
  getGameById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const game = await db.from("games").select().eq("id", input.id).single();

      if (game.error) {
        posthogClient.capture({
          distinctId: ctx.user.id,
          event: "game_get_failed",
          properties: {
            error: {
              ...game.error,
            },
            email: ctx.user.email,
          },
        });
        throw new Error("Failed to get game");
      }

      posthogClient.capture({
        distinctId: ctx.user.id,
        event: "game_get",
        properties: {
          game_id: game.data.id,
          email: ctx.user.email,
        },
      });

      return game.data;
    }),

  create: privateProcedure
    .input(GenerateGameSchema)
    // Can be later extracted to other routes if required
    .use(async ({ ctx, next }) => {
      const { user, db } = ctx;
      const profile = await db
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();

      if (profile.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error retrieving profile",
        });
      }

      const isUnlimited = profile.data.subscription_status === PREMIUM_STATUS;
      const canCreateGame = isUnlimited || profile.data.credits_available > 0;
      console.log("canCreateGame", canCreateGame, isUnlimited)

      if (!canCreateGame) {
        posthogClient.capture({
          distinctId: ctx.user.id,
          event: "attempted_game_creation_without_credits",
          properties: {
            email: ctx.user.email,
          },
        });
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "M: Not enough credits to create a game",
        });
      }

      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const { user, db } = ctx;
      const prompt = getGenerateGamePrompt(input);
      let gameId = "";

      const { data: billingData } = await db
        .from("profiles")
        .select("credits_available, subscription_status")
        .eq("id", user.id)
        .single();

      const currentCredits = billingData?.credits_available || 0;
      const isPremium = billingData?.subscription_status === PREMIUM_STATUS;
      const newCredits = currentCredits - 1;

      await experimental_generateText({
        model: openai.chat("gpt-4-0125-preview"),
        tools: {
          game: {
            description:
              "Generate a fun, innovative game for a group of people.",
            parameters: functionCallingParams,
            execute: async (data: z.infer<typeof functionCallingParams>) => {
              const gameSaveResult = await db
                .from("games")
                .insert({
                  created_by: user.id,
                  title: data.title,
                  purpose: data.purpose,
                  how_to_win: data.howToWin,
                  how_to_play: data.howToPlay,
                  setup: data.setup,
                  rules: data.rules,
                  additional_info: data.additionalInfo,
                  is_published: true,
                })
                .select("id")
                .single();

              if (!isPremium) {
                await db
                  .from("profiles")
                  .update({
                    credits_available: newCredits,
                  })
                  .eq("id", user.id);
              }

              if (gameSaveResult.error) {
                posthogClient.capture({
                  distinctId: ctx.user.id,
                  event: "game_gen_failed",
                  properties: {
                    error: {
                      ...gameSaveResult.error,
                    },
                    email: ctx.user.email,
                  },
                });
                throw new Error("Failed to create a game");
              }

              posthogClient.capture({
                distinctId: ctx.user.id,
                event: "game_gen_succeeded",
                properties: {
                  game_id: gameSaveResult.data.id,
                  email: ctx.user.email,
                },
              });

              gameId = gameSaveResult.data.id;

              await db.from("prompts").insert({
                game: gameSaveResult.data.id,
                amount_of_players: input.amountOfPlayers,
                duration: input.duration,
                location: input.location,
                minimum_age: input.minimumAge,
                custom_instructions: input.customInstructions,
                props: input.props,
              });
              posthogClient.capture({
                distinctId: ctx.user.id,
                event: "prompt_saved",
                properties: {
                  game_id: gameSaveResult.data.id,
                  email: ctx.user.email,
                },
              });

              return { id: gameSaveResult.data.id };
            },
          },
        },
        prompt,
      });

      return { id: gameId };
    }),
});
