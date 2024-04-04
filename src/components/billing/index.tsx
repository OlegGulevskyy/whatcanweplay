"use client";

import { api } from "~/trpc/react";
import { LoadingScreen } from "../Loading";
import { Button } from "../ui/button";
import { PenIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";
import {
  PLAY_ROUTE_PATH,
  SEND_MESSAGE_ROUTE_PATH,
} from "~/constants/navigation";
import { TWITTER_URL } from "~/constants/urls";
import {
  createCheckoutSession,
  getStripeUserPortalSession,
} from "~/app/actions/stripe";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { formatAmountForDisplay } from "~/utils/price-helpers";
import { PRICE } from "~/constants/billing";
import { useServerAction } from "~/hooks/use-server-action";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useBilling } from "~/hooks/use-billing";

const getSubStatus = (status: string | null | undefined) => {
  if (!status) {
    return "free tier";
  }
  return "Premium ⭐";
};

const GetInTouchBlock = () => {
  return (
    <>
      <a
        className="mt-4 inline-flex w-full gap-2 text-indigo-700 underline underline-offset-4"
        href={TWITTER_URL}
      >
        {<TwitterIcon />}
        Twitter
      </a>
      <Link
        className="mt-4 inline-flex w-full gap-2 text-indigo-700 underline underline-offset-4"
        href={SEND_MESSAGE_ROUTE_PATH}
      >
        {<PenIcon />}
        Contact form
      </Link>
    </>
  );
};

export const BillingView = () => {
  const router = useRouter();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError,
  } = api.profile.get.useQuery();
  const [createCheckout, isCheckoutLoading] = useServerAction(
    createCheckoutSession,
  );
  const { isPremium, customerStripeId } = useBilling();
  const [billingPortalUrl, setBillingPortalUrl] = useState<
    string | null | undefined
  >(null);

  const handleSubscribe = async () => {
    const checkoutSession = await createCheckout();
    if (!checkoutSession || !checkoutSession.url) {
      toast({
        variant: "destructive",
        description: "Something went wrong while creating a checkout session.",
      });
      return;
    }
    router.push(checkoutSession.url);
  };

  useEffect(() => {
    if (isPremium && customerStripeId && !billingPortalUrl) {
      getStripeUserPortalSession(customerStripeId).then(({ url }) =>
        setBillingPortalUrl(url),
      );
    }
  }, [isPremium, customerStripeId, billingPortalUrl]);

  if (isProfileLoading) {
    return <LoadingScreen />;
  }

  if (!profileData || isError) {
    return (
      <div className="p-4">
        <p className="font-medium">
          Something went wrong while looking for your profile. I have been
          notified and looking into it.
        </p>
        <p className="mt-4">
          To speed it up feel free to get in touch with me:
        </p>
        <GetInTouchBlock />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="m-4 rounded-lg border border-slate-200 p-4">
        <p className="text-lg font-medium text-slate-500">Available Credits</p>
        <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
          {!profileData?.subscriptionStatus ? (
            <span>{profileData?.creditsAvailable}</span>
          ) : (
            <span>Unlimited</span>
          )}
          <span className="ml-2 text-sm font-medium text-gray-500">
            / {getSubStatus(profileData?.subscriptionStatus)}
          </span>
        </div>
        {billingPortalUrl && (
          <a href={billingPortalUrl ?? ""} target="_blank">
            <Button className="mt-6 w-full" variant="outline">
              Manage my subscription
            </Button>
          </a>
        )}
      </div>

      <div>
        {profileData?.subscriptionStatus ? (
          <div>
            <p className="text-center text-xl font-bold">Thank you! 🙏</p>
            <p className="mt-4 px-4 text-slate-700">
              Your subscription means a world to me! 🌍{" "}
            </p>
            <p className="mt-4 inline-flex px-4 text-slate-700">
              Do not hesitate to get in touch with me, I am looking for
              feedback.
            </p>
            <div className="px-4">
              <GetInTouchBlock />
            </div>
            <p className="mt-4 inline-flex px-4 text-slate-700"></p>
            <div className="px-4">
              <Link href={PLAY_ROUTE_PATH}>
                <Button className="w-full text-md">Let's generate a game!</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="ml-4 text-lg font-bold text-slate-600">
              Available Plans
            </h1>

            <div className="m-4 rounded-lg border border-slate-200 p-4">
              <p className="text-lg font-medium text-slate-500">Premium 🔥</p>
              <div className="mt-2 flex items-baseline text-2xl font-semibold text-indigo-600">
                Unlimited
                <span className="ml-2 text-sm font-medium text-gray-500">
                  credits /{" "}
                  <b>{formatAmountForDisplay(PRICE, "eur")} per month</b>
                </span>
              </div>
              <Button
                onClick={handleSubscribe}
                className="text-md mt-6 w-full"
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? (
                  <ReloadIcon className="h-6 w-auto animate-spin" />
                ) : (
                  <span>Subscribe</span>
                )}
              </Button>
              <p className="mt-2 text-right italic text-slate-500">
                *Cancel anytime
              </p>
            </div>
            <p className="mt-8 px-4 text-slate-600">
              By subscribing, you support{" "}
              <a
                href="https://twitter.com/preacher_rourke"
                className="inline-flex items-center gap-1 text-indigo-700 underline underline-offset-2"
                target="_blank"
              >
                me {<TwitterIcon className="h-5 w-5" />}
              </a>{" "}
              and my fiancee in our preparation for the wedding and our
              honeymoon . <br />
              <br />
              <span className="font-bold">Thank you for considering! 🙏💝</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
