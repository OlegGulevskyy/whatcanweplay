"use client";

import { ThemeProvider } from "next-themes";
import React, { type PropsWithChildren } from "react";
import { CSPostHogProvider } from "./PosthogProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <CSPostHogProvider>
        <ThemeProvider attribute="class" forcedTheme="light">
          {children}
        </ThemeProvider>
      </CSPostHogProvider>
    </>
  );
}
