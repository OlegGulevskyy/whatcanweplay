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
});

export function ProfileSettingsView() {
  const { data } = api.profile.get.useQuery();
  const { mutateAsync: updateProfile, isLoading: isUpdating } =
    api.profile.updateProfile.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: data?.fullName ?? "",
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
      <Image
        src={data?.avatarUrl ?? ""}
        alt="Profile picture"
        width={400}
        height={400}
        className="h-24 w-24 rounded-2xl"
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
                This is the name that will be displayed on your profile.
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
