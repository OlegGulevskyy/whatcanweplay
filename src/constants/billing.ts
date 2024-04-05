import { env } from "~/env.mjs";

export const PREMIUM_STATUS = "active_premium";

export const PRICE_PACKS = [
  {
    priceId: env.NEXT_PUBLIC_STRIPE_PRICE_ID_LOW,
    label: "Starter Pack",
    credits: 3,
    price: 2.99,
  },
  {
    priceId: env.NEXT_PUBLIC_STRIPE_PRICE_ID_MID,
    label: "Can't Stop Me Now Pack",
    credits: 5,
    price: 3.99,
  },
  {
    priceId: env.NEXT_PUBLIC_STRIPE_PRICE_ID_HIGH,
    label: "Legendary Player Pack",
    credits: 10,
    bonus: 2,
    price: 7.99,
    isBestValue: true,
  },
];
