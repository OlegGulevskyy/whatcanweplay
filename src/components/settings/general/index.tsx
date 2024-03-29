"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "~/utils/cn";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import Image from "next/image";
import { useAppParams } from "~/hooks/use-app-params";
import { useRouter } from "next/navigation";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

const languages = [
  { label: "English", value: "en", svgIcon: "/assets/icons/en-gb.svg" },
  { label: "French", value: "fr", svgIcon: "/assets/icons/fr.svg" },
] as const;

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
});

export function GeneralSettingsView() {
  const params = useAppParams();
  const router = useRouter();
  const { mutateAsync: updatePreferences } =
    api.profile.updateProfile.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      language: params.lang,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const lang = data.language;
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(params.lang, lang);
    router.replace(newPath);
    updatePreferences({ langPref: lang }); // silently update language preference
    toast({
      title: "Preferences updated",
      description: "Your language has been updated.",
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
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value,
                          )?.label
                        : "Select language"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search language..."
                      className="h-9"
                    />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          value={language.label}
                          key={language.value}
                          onSelect={() => {
                            form.setValue("language", language.value);
                          }}
                        >
                          <Image
                            src={language.svgIcon}
                            alt="svg icon"
                            height={12}
                            width={12}
                            className="mr-2 h-4 w-4"
                          />
                          {language.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              language.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="text-md w-full" type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
}
