import { useMemo } from "react";
import { PREMIUM_STATUS } from "~/constants/billing";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import { api } from "~/trpc/react";

export const useBilling = () => {
  const user = useUser();
  const { data: profileData, isLoading: isProfileLoading } =
    api.profile.get.useQuery(undefined, { enabled: !!user.session });

  const canGenerateGame = useMemo(() => {
    if (!profileData || isProfileLoading) return false;
    if (profileData.subscriptionStatus === PREMIUM_STATUS) return true;
    if (profileData.creditsAvailable > 0) return true;
  }, [isProfileLoading, profileData]);

  return {
    canGenerateGame,
    isLoading: isProfileLoading,
    isPremium: profileData?.subscriptionStatus === PREMIUM_STATUS,
    customerStripeId: profileData?.customerStripeId,
  };
};
