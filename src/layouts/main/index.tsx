"use client";

import { type PropsWithChildren } from "react";
import { PageLayout } from "~/components/page-layout";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <PageLayout>
      <PageLayout.Header />
      <PageLayout.Body>{children}</PageLayout.Body>
    </PageLayout>
  );
}
