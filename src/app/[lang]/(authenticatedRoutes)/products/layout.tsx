import type { PropsWithChildren } from "react";

export const metadata = {
  title: "Izeat - My products",
  description: "User product's page",
};

const ProductListLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default ProductListLayout;
