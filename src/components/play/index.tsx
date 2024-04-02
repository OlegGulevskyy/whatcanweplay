"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import Image from "next/image";
import { MagicWandIcon, ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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
import { PageLayout } from "~/components/page-layout";
import { LocationComboBox } from "~/components/location-combo-box";
import { GenerateGameSchema } from "~/components/play/form-schema";
import { toast } from "~/components/ui/use-toast";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import { LOGIN_ROUTE_PATH } from "~/constants/navigation";
import { useRouter } from "next/navigation";

const CTAButton = ({
  isLoading,
  ctaLabel,
}: {
  onCtaClick: () => void;
  isLoading: boolean;
  ctaLabel: string;
}) => {
  const user = useUser();
  if (!user.session) {
    return (
      <Link href={LOGIN_ROUTE_PATH} className="w-full">
        <Button className="w-full">
          <span className="text-lg font-bold">Sign in to generate</span>
        </Button>
      </Link>
    );
  }

  return (
    <Button
      form="generate-game-form"
      className="flex w-full flex-row gap-4"
      type="submit"
      disabled={isLoading || !user.session}
    >
      {isLoading ? (
        <ReloadIcon className="h-6 w-auto animate-spin" />
      ) : (
        <MagicWandIcon className="h-6 w-auto text-yellow-400" />
      )}
      <span className="text-lg font-bold">{ctaLabel}</span>
    </Button>
  );
};

export function PlayView() {
  const form = useForm<z.infer<typeof GenerateGameSchema>>({
    resolver: zodResolver(GenerateGameSchema),
    defaultValues: {
      location: "bar",
      amountOfPlayers: 2,
      duration: 30,
      minimumAge: 18,
    },
  });

  const { mutateAsync: createGame, isLoading: isGameCreating } =
    api.game.create.useMutation();

  const router = useRouter();

  const allFieldsDisabled = isGameCreating;

  function submitGeneration() {
    const values = form.getValues();
    createGame(values)
      .then((res) => {
        router.push(`/game/${res.id}`);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Something went wrong 🤯",
          description:
            "Failed to generate a game. Please try again or reach out for support.",
        });
        console.warn("Failed to generate game", err);
      });
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
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">Location</FormLabel>
                  <FormControl>
                    <LocationComboBox disabled={allFieldsDisabled} {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-sm italic">
                    The game will be adapted based on the type of location you
                    are at currently.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amountOfPlayers"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">
                    👯 Amount of players
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      disabled={allFieldsDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-sm italic">
                    How many players will be playing the game?
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">
                    ⏰ Preferred duration
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center gap-4">
                      <Input
                        {...field}
                        type="number"
                        className="w-1/2"
                        disabled={allFieldsDisabled}
                      />
                      <span>minutes</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-sm italic">
                    How long you want the game to last.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumAge"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">
                    🔞 Minimum age preference
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center gap-4">
                      <Input
                        {...field}
                        type="number"
                        className="w-1/2"
                        disabled={allFieldsDisabled}
                      />
                      <span>years</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-sm italic">
                    Who is the youngest player among the players?
                    <br />
                    (used mainly for 18+ 👀 games)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customInstructions"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">
                    🌶️ Specific comments?
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="My mates can't stand tequila"
                      disabled={allFieldsDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-sm italic">
                    You can mention any specific preferences or requirements.
                    For example:
                    <br />
                    (quite game, sofa mode, include alcohol, etc.)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="props"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">🪝 Props</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={allFieldsDisabled}
                      placeholder="Tequila, cards and a table"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-sm italic">
                    Do you have any props available at your disposal?
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </PageLayout.Body>
      <PageLayout.Footer>
        <CTAButton
          onCtaClick={submitGeneration}
          isLoading={isGameCreating}
          ctaLabel={isGameCreating ? "Creating your game.." : "Create Game"}
        />
      </PageLayout.Footer>
    </PageLayout>
  );
}
