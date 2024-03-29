"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { getNextStepHref } from "~/layouts/create-product/utils";

const FormSchema = z.object({
  title: z.string().min(3, {
    message: "Product title must be at least 3 characters.",
  }),
});

export function CreateProductTitleView() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    console.log(formData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product title</FormLabel>
              <FormControl>
                <Input placeholder="Garden tomatoes..." {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is how your product will be displayed to other users on{" "}
                <b>Izeat</b>.
              </FormDescription>
            </FormItem>
          )}
        />
        <Link href={getNextStepHref() ?? "#"}>
          <Button className="mt-8 w-full">Save and continue</Button>
        </Link>
      </form>
    </Form>
  );
}
