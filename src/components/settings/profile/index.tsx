"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

import { api } from "~/trpc/react";
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
import { toast } from "~/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";

const FormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),

  picture: z.string(),
});

export function ProfileSettingsView() {
  const { data } = api.profile.get.useQuery();
  const { mutateAsync: updateProfile, isLoading: isUpdating } =
    api.profile.updateProfile.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: data?.fullName ?? "",
      picture: data?.avatarUrl ?? "",
    },
  });

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    updateProfile(formData)
      .then(() => {
        toast({
          title: "Success!",
          description: "Profile settings saved!",
        });
      })
      .catch((err) => {
        toast({
          title: "Something went wrong!",
          description:
            err.message ?? "An error occurred while updating profile.",
        });
      });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 p-4"
      >
        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex flex-row items-center gap-4">
                  <Image
                    src={field.value}
                    alt="Profile picture"
                    width={400}
                    height={400}
                    className="h-24 w-24 rounded-2xl"
                  />
                  <div>
                    <Input id="picture" type="file" className="text-sm" />
                    <p className="mt-2 text-sm text-slate-600">
                      JPG or PNG. 1MB max.
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is how other users will see you on <b>Izeat</b>.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isUpdating}>
          {isUpdating && <ReloadIcon className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </form>
    </Form>
  );
}
