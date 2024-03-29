import { headers } from "next/headers";
import { Roboto } from "next/font/google";
import { dir } from "i18next";

import { TailwindIndicator } from "~/components/tw-indicator";
import { Providers } from "~/providers";
import { cn } from "~/utils/cn";
import { Toaster } from "~/components/ui/toaster";
import { getServerUser } from "~/utils/auth";
import { AuthProvider } from "~/providers/AuthProvider/AuthProvider";
import { TRPCReactProvider } from "~/trpc/react";
import { MainLayout } from "~/layouts/main";
import { languages } from "~/app/i18n/settings";

import "~/styles/globals.css";
import st from "./layout.module.css";

const font = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const user = await getServerUser();

  return (
    <>
      <html lang={params.lang} dir={dir(params.lang)}>
        <head />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <body
          className={cn(
            "flex flex-col bg-background font-sans antialiased",
            font.className,
            st.global,
          )}
        >
          <TRPCReactProvider headers={headers()}>
            <AuthProvider {...user}>
              <Providers>
                <MainLayout>{children}</MainLayout>
                <Toaster />
              </Providers>
            </AuthProvider>
          </TRPCReactProvider>
          <TailwindIndicator />
        </body>
      </html>
    </>
  );
}

export default RootLayout;
