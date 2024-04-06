"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PageLayout } from "~/components/page-layout";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import { toast } from "~/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

const FormSchema = z.object({
  loveOrHateMessage: z
    .string()
    .min(5, {
      message: "Please, include at least 5 characters.",
    })
    .max(300),
});

export const SendMessageView = () => {
  const { user } = useUser();
  const { mutateAsync: sendDiscordMessage, isLoading: isSendingMessage } =
    api.discord.sendDiscordMessage.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (!user || !user.email) {
      toast({ title: "You need to be logged in.", variant: "destructive" });
      return;
    }

    sendDiscordMessage({
      message: formData.loveOrHateMessage,
      user: user.email,
      channel: "messages",
    })
      .then(() => {
        toast({
          title: "Your message has been sent!",
          description: "I'll get back to you as soon as possible.",
        });
      })
      .catch((err) => {
        toast({
          title: "Your message could not be sent.",
          description: err.message,
        });
      });
  }

  return (
    <PageLayout>
      <PageLayout.Header />
      <PageLayout.Body>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Send a message</h1>
          <p className="mt-4 text-slate-700">
            Super excited you consider to send a message!
          </p>

          <p className="text-slate-700">
            I read all the messages and reply to each one of them.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-12 w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="loveOrHateMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Your &apos;love or hate&apos; message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="text-md"
                        placeholder="I love/hate... because..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>* Maximum 300 characters.</FormDescription>
                  </FormItem>
                )}
              />
              <Button
                className="text-md w-full"
                type="submit"
                disabled={isSendingMessage}
              >
                Send
              </Button>
            </form>
          </Form>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};
