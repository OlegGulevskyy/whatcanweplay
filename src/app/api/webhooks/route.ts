import type { Stripe } from "stripe";

import { NextResponse } from "next/server";

import { stripe } from "~/lib/stripe";
import { env } from "~/env.mjs";
import { supabase } from "~/server/supabase/supabaseClient";
import { posthogClient } from "~/server/posthog";
import { PREMIUM_STATUS } from "~/constants/billing";
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
          break;
        case "payment_intent.payment_failed":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          const { customer } = data;

          if (!customer) {
            posthogClient.capture({
              distinctId: "unknown",
              event: "payment_failed_no_customer",
              properties: {
                error: "No customer",
                payment_intent_id: data.id,
                amount: data.amount,
                currency: data.currency,
              },
            });
          }

          const stripeCus = await stripe.customers.retrieve(
            customer?.toString() ?? "",
          );

          if (stripeCus.deleted) {
            console.log("customer was deleted, nothing to do");
            return;
          }

          if (!stripeCus.email) {
            return;
          }

          const sb = supabase();
          await sb
            .from("profiles")
            .update({
              subscription_status: null,
            })
            .eq("email", stripeCus.email);

          break;

        case "payment_intent.succeeded":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent status: ${data.status}`);
          const customerId = data.customer;
          const stripeCustomer = await stripe.customers.retrieve(
            customerId?.toString() ?? "",
          );
          if (stripeCustomer.deleted) {
            console.log("customer was deleted");
            return;
          }

          if (!stripeCustomer.email) {
            console.log("No email");
            posthogClient.capture({
              distinctId: stripeCustomer.id,
              event: "payment_no_email",
              properties: {
                error: "No email",
                payment_intent_id: data.id,
                amount: data.amount,
                currency: data.currency,
              },
            });
            return;
          }

          const db = supabase();
          const result = await db
            .from("profiles")
            .update({
              stripe_customer_id: stripeCustomer.id,
              subscription_status: PREMIUM_STATUS,
            })
            .eq("email", stripeCustomer.email);

          console.log("Updated profile and set premium status");
          console.log(result.error);
          posthogClient.capture({
            distinctId: stripeCustomer.id,
            event: "payment_succeeded",
            properties: {
              email: stripeCustomer.email,
              payment_intent_id: data.id,
              amount: data.amount,
              currency: data.currency,
            },
          });

          await postDiscordMessage("Payment succeeded", stripeCustomer.email);

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
