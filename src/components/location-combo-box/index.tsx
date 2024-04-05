"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { SEND_MESSAGE_ROUTE_PATH } from "~/constants/navigation";
import { locations } from "~/constants/game-locations";

export const LocationComboBox = React.forwardRef(
  (
    {
      value,
      onChange,
      disabled,
    }: { value: string; onChange: (s: string) => void; disabled?: boolean },
    _,
  ) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="text-md w-full justify-between"
            disabled={disabled}
          >
            {value
              ? locations.find((framework) => framework.value === value)?.label
              : "Select location..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search location..." className="h-9" />
            <CommandEmpty>
              <div className="flex max-w-full flex-col px-3 text-left">
                <p className="text-sm">No option found</p>
                <p className="text-sm">
                  Let me know if you want to add a new location
                </p>
                <Link href={SEND_MESSAGE_ROUTE_PATH}>
                  <Button className="mt-4 bg-indigo-500">
                    Drop a suggestion
                  </Button>
                </Link>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {locations.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
