import type { PropsWithChildren } from "react";
import { CreateProductLayout } from "~/layouts/create-product";

export const metadata = {
  title: "Izeat - Post product",
  description: "Post product for sale on Izeat",
};

const ProductListLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="py-4">
      <CreateProductLayout>{children}</CreateProductLayout>
    </div>
  );
};

export default ProductListLayout;
