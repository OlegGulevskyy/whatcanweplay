import type { PropsWithChildren } from "react";

export const metadata = {
  title: "Izeat - Billing",
  description: "Billing settings page",
};

const BillingSettingsLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default BillingSettingsLayout;
