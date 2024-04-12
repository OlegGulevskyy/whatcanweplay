"use client";

import { PageLayout } from "~/components/page-layout";
import { GetInTouchBlock } from "../get-in-touch";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { GENERATE_GAME_ROUTE_PATH } from "~/constants/navigation";

export const ThankYouView = () => {
  return (
    <PageLayout>
      <PageLayout.Header />
      <PageLayout.Body>
        <div className="px-4">
          <h1 className="mt-24 text-center text-4xl font-semibold text-indigo-600">
            Thank you! 🙏
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Your purchase means a world to me! 🌍
          </p>
          <p className="mt-4 text-lg text-gray-500">
            I am always looking for feedback and ways to improve{" "}
            <b>&quot;What Can We Play&quot;</b>. If you have anything on your mind, I will
            always reply.
          </p>
          <GetInTouchBlock />
        </div>
      </PageLayout.Body>
      <PageLayout.Footer>
        <Link href={GENERATE_GAME_ROUTE_PATH} className="w-full">
          <Button className="text-md w-full">🚀 Start generating games</Button>
        </Link>
      </PageLayout.Footer>
    </PageLayout>
  );
};
