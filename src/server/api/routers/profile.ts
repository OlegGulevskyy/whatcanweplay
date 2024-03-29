import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  get: privateProcedure.query(({ ctx }) => {
    const profile = ctx.db.profiles.findFirst({
      where: {
        id: ctx.user.id,
      },
    });
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
      return ctx.db.profiles.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          fullName: input.fullName,
          avatarUrl: input.avatarUrl,
          languagePreference: input.langPref,
          updatedAt: new Date(),
        },
      });
    }),
});
