"use client";

import { PropsWithChildren } from "react";
import { PageLayout } from "~/components/page-layout";

const GameDetailsLayout = ({ children }: PropsWithChildren) => {
  return (
    <PageLayout>
      <PageLayout.Header />
      <PageLayout.Body>{children}</PageLayout.Body>
    </PageLayout>
  );
};

export default GameDetailsLayout;
