"use client";

import { type Provider } from "@supabase/supabase-js";
import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/button";
import { supabase } from "~/server/supabase/supabaseClient";

const Page = () => {
  const signInWithOauth = (provider: Provider) => {
    void supabase().auth.signInWithOAuth({
      provider: provider,
    });
  };

  return (
    <section className="flex h-full flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Sign in to Izeat
        </h1>
        <p className="text-md text-center text-slate-700">
          To continue using <span className="font-bold">Izeat</span>, please
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
  );
};

export default Page;
