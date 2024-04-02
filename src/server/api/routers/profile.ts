import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  get: privateProcedure.query(({ ctx }) => {
    const profile = ctx.db.from("profiles").select("*").eq("id", ctx.user.id);
    return profile;
  }),
  updateProfile: privateProcedure
    .input(
      z.object({
        fullName: z.string().optional(),
        avatarUrl: z.string().optional(),
        langPref: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .from("profiles")
        .update({
          full_name: input.fullName,
          avatar_url: input.avatarUrl,
          language_preference: input.langPref,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ctx.user.id);
    }),
});
