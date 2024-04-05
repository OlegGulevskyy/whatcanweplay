import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  get: privateProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db
      .from("profiles")
      .select("*")
      .eq("id", ctx.user.id)
      .single();
    if (profile.error) {
      throw new Error("Error retrieving profile");
    }

    if (profile.data === null) {
      throw new Error("Profile not found");
    }

    return {
      id: profile.data.id,
      fullName: profile.data.full_name,
      avatarUrl: profile.data.avatar_url,
      langPref: profile.data.language_preference,
      creditsAvailable: profile.data.credits_available,
      subscriptionStatus: profile.data.subscription_status,
      customerStripeId: profile.data.stripe_customer_id,
      isPremium: profile.data.is_premium,
    };
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
