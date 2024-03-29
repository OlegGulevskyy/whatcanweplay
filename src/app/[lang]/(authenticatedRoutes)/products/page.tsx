import Link from "next/link";

import { Button } from "~/components/ui/button";
import { CREATE_PRODUCT_TITLE_PATH } from "~/constants/navigation";

export default function ProductsPage() {
  return (
    <div className="p-4 py-10">
      <h1 className="text-2xl font-semibold">Products</h1>
      <p className="mt-2">This is the products page.</p>
      <Link href={CREATE_PRODUCT_TITLE_PATH}>
        <Button className="mt-6 w-full">Post product</Button>
      </Link>
    </div>
  );
}
