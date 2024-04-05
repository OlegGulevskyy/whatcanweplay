import type { Stripe } from "stripe";

import { NextResponse } from "next/server";

import { stripe } from "~/lib/stripe";
import { env } from "~/env.mjs";
import { supabase } from "~/server/supabase/supabaseClient";
import { posthogClient } from "~/server/posthog";
import { PRICE_PACKS } from "~/constants/billing";
import { postDiscordMessage } from "~/lib/discord";

export async function POST(req: Request) {
  let event: Stripe.Event;
  try {
    const body = await (await req.blob()).text();
    event = stripe.webhooks.constructEvent(
      body,
      req.headers.get("stripe-signature") as string,
      env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  // Successfully constructed event.
  console.log("✅ Success:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;
          console.log(`💰 CheckoutSession status: ${data.payment_status}`);
          const checkoutSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items"],
            },
          );

          const [item] = checkoutSession.line_items?.data ?? [];
          if (!item) {
            break;
          }

          const foundPack = PRICE_PACKS.find(
            (p) => p.priceId === item.price?.id,
          );
          if (!foundPack || !data.customer_email) {
            break;
          }

          const sb = supabase();
          const creditsToGive = foundPack.credits + (foundPack.bonus ?? 0);
          await sb.rpc("incrementby", {
            x: creditsToGive,
            user_email: data.customer_email,
          });
          await sb
            .from("profiles")
            .update({ is_premium: true })
            .eq("email", data.customer_email);

          postDiscordMessage({
            message: `Payment received - ${foundPack.price}!`,
            user: data.customer_email,
          });

          posthogClient.capture({
            distinctId: data.customer_email,
            event: "payment_succeeded",
            properties: {
              payment_intent_id: data.id,
              amount: foundPack.price,
              currency: data.currency,
            },
          });
          console.log(
            `🎉 Added ${creditsToGive} credits to ${data.customer_email}. Received ${foundPack.price}!`,
          );

          break;
        case "payment_intent.payment_failed":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case "payment_intent.succeeded":
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 },
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
