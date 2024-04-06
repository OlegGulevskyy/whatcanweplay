"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { TwitterIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { LoadingScreen } from "~/components/Loading";
import { Button } from "~/components/ui/button";
import { createCheckoutSession } from "~/app/actions/stripe";
import { toast } from "~/components/ui/use-toast";
import { formatAmountForDisplay } from "~/utils/price-helpers";
import { PRICE_PACKS } from "~/constants/billing";
import { useServerAction } from "~/hooks/use-server-action";
import { cn } from "~/utils/cn";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import { GetInTouchBlock } from "~/components/get-in-touch";

type AvailablePackProps = {
  label: string;
  credits: number;
  price: number;
  bonus?: number;
  handleSelectPack: () => void;
  disabled: boolean;
  isLoading: boolean;
  isBestValue?: boolean;
};
const AvailablePack = ({
  label,
  price,
  credits,
  handleSelectPack,
  disabled,
  bonus,
  isLoading,
  isBestValue,
}: AvailablePackProps) => {
  return (
    <div
      className={cn(
        "m-4 rounded-lg border border-slate-200 p-4",
        isBestValue &&
          "bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-pink-500/20",
        isBestValue && "border-indigo-500",
      )}
    >
      <p
        className={cn("text-lg font-medium", isBestValue && "text-indigo-600")}
      >
        {label}
      </p>
      <div className="mt-2 flex items-baseline text-2xl font-semibold text-indigo-600">
        {credits}
        {bonus && <span className="text-md ml-2 font-medium">+ {bonus}</span>}
        <span className="ml-2 text-sm font-medium text-gray-500">
          credits / <b>{formatAmountForDisplay(price, "eur")}</b>
        </span>
      </div>
      <Button
        onClick={handleSelectPack}
        className="text-md mt-6 w-full"
        disabled={disabled}
      >
        {isLoading ? (
          <ReloadIcon className="h-6 w-auto animate-spin" />
        ) : (
          <span>
            Grab <b>{label}</b>
          </span>
        )}
      </Button>
    </div>
  );
};

export const BillingView = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError,
  } = api.profile.get.useQuery();
  const [createCheckout, isCheckoutLoading] = useServerAction(
    createCheckoutSession,
  );

  const handleSelectPack = async (id: string) => {
    const checkoutSession = await createCheckout(id, user?.email ?? "");
    if (!checkoutSession || !checkoutSession.url) {
      toast({
        variant: "destructive",
        description: "Something went wrong while creating a checkout session.",
      });
      return;
    }
    router.push(checkoutSession.url);
  };

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
    <div className="flex flex-col gap-4 pb-12">
      <div className="m-4 rounded-lg border border-slate-200 p-4">
        <p className="text-lg font-medium text-slate-500">Available Credits</p>
        <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
          <span>{profileData?.creditsAvailable}</span>
        </div>
      </div>

      <div>
        <div>
          <h1 className="ml-4 text-lg font-bold text-slate-600">
            🏪 Store - Available Packs
          </h1>
          {PRICE_PACKS.map((pack) => (
            <AvailablePack
              key={pack.priceId}
              label={pack.label}
              price={pack.price}
              credits={pack.credits}
              disabled={isCheckoutLoading}
              isLoading={isCheckoutLoading}
              handleSelectPack={() => handleSelectPack(pack.priceId)}
              bonus={pack.bonus}
              isBestValue={pack.isBestValue}
            />
          ))}

          <p className="mt-8 px-4 text-slate-600">
            By purchasing a pack, you support{" "}
            <a
              href="https://twitter.com/preacher_rourke"
              className="inline-flex items-center gap-1 text-indigo-700 underline underline-offset-2"
              target="_blank"
            >
              me <TwitterIcon className="h-5 w-5" />
            </a>{" "}
            and my fiancee in our preparation for the wedding and our honeymoon.
            <br />
            <br />
            <span className="font-bold">Thank you for considering! 🙏💝</span>
          </p>
        </div>
      </div>
    </div>
  );
};
