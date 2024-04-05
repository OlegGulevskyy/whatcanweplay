"use server";

import type { Stripe } from "stripe";

import { headers } from "next/headers";

import { CURRENCY } from "~/constants";
import { formatAmountForStripe } from "~/utils/price-helpers";
import { stripe } from "~/lib/stripe";
import { SETTINGS_BILLING_ROUTE_PATH, THANK_YOU_ROUTE_PATH } from "~/constants/navigation";

export async function createCheckoutSession(priceId: string, email: string): Promise<{
  client_secret: string | null;
  url: string | null;
}> {
  const origin: string = headers().get("origin") as string;

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price: priceId,
        },
      ],
      expand: ["line_items"],
      customer_email: email,
      success_url: `${origin}${THANK_YOU_ROUTE_PATH}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${SETTINGS_BILLING_ROUTE_PATH}`,
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function createPaymentIntent(
  data: FormData,
): Promise<{ client_secret: string }> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: formatAmountForStripe(
        Number(data.get("customDonation") as string),
        CURRENCY,
      ),
      automatic_payment_methods: { enabled: true },
      currency: CURRENCY,
    });

  return { client_secret: paymentIntent.client_secret as string };
}

export async function getStripeUserPortalSession(
  customer: string | undefined | null,
): Promise<{ url: string }> {
  if (!customer) throw new Error("No customer found");

  const origin: string = headers().get("origin") as string;

  const session: Stripe.BillingPortal.Session =
    await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${origin}${SETTINGS_BILLING_ROUTE_PATH}`,
    });

  return { url: session.url };
}
