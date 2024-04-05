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
import { sendDiscordMessageServer } from "~/app/actions/discord";

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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      loveOrHateMessage:
        'Love "What Can We Play", but this could be a killer feature...',
    },
  });

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    sendDiscordMessageServer({
      message: formData.loveOrHateMessage,
      user: user?.email,
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
                      Your love or hate message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="text-md"
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      I read all the messages and reply to each one of them.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button className="text-md w-full" type="submit">
                Send
              </Button>
            </form>
          </Form>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};
