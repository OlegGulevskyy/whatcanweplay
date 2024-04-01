"use client";

import { type Provider } from "@supabase/supabase-js";
import { Icons } from "~/components/icons";
import { PageLayout } from "~/components/page-layout";
import { Button } from "~/components/ui/button";
import { supabase } from "~/server/supabase/supabaseClient";

export const LoginView = ({ referer }: { referer: string | null }) => {
  const signInWithOauth = (provider: Provider) => {
    void supabase().auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: referer || "/",
      }
    });
  };

  return (
    <PageLayout>
      <PageLayout.Header />
      <section className="flex h-full flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="mt-10 text-center text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Sign in to continue
          </h1>
          <p className="text-md text-slate-700 px-4 mt-2">
            To continue using <span className="font-bold">What Can We Play</span>, please
            sign in below.
          </p>
        </div>
        <div className="flex items-center justify-center p-4">
          <Button
            variant="outline"
            className="flex w-full flex-row gap-4 p-6 text-lg"
            onClick={() => {
              signInWithOauth("google");
            }}
          >
            <Icons.google width={24} />
            Sign in with Google
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

