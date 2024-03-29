"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

// import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
// import { toast } from "~/components/ui/use-toast";
import { MagicWandIcon /* ReloadIcon */ } from "@radix-ui/react-icons";
import { PageLayout } from "../page-layout";
// import { LoremIpsumLongText } from "~/utils/dummy/loads-of-text";

const FormSchema = z.object({
  location: z.string().nonempty(),
});

export function PlayView() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function submitGeneration() {
    const values = form.getValues();
    console.log("values", values);
  }

  return (
    <PageLayout>
      <PageLayout.Header />
      <PageLayout.Body>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitGeneration)}
            className="w-full space-y-6 p-4"
            id="generate-game-form"
          >
            <Image
              src="/assets/images/quite-or-not.jpeg"
              alt="Play Game Image"
              width={800}
              height={800}
              className="mx-auto h-48 w-auto rounded-lg"
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Bar" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-sm italic">
                    The game will be adapted based on the type of location you
                    are at currently.
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </PageLayout.Body>
      <PageLayout.Footer>
        <Button
          form="generate-game-form"
          className="flex w-full flex-row gap-4"
          type="submit"
          onClick={submitGeneration}
        >
          <MagicWandIcon className="h-6 w-auto text-yellow-400" />
          <span className="text-lg font-bold">Generate</span>
        </Button>
      </PageLayout.Footer>
    </PageLayout>
  );
}
