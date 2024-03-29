import Link from "next/link";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";

export default function FourOhFour() {
  return (
    <>
      <PageHeader>Oopsie, something is wrong;</PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-slate-700">
          The page you are looking for does not exist.
        </p>

        <Button asChild variant="outline" className="mt-4">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </>
  );
}
