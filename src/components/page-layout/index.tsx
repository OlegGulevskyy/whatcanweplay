"use client";

import { Fragment, type PropsWithChildren } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { HeaderDesktop } from "~/components/header-nav/desktop";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import { useCurrentPath } from "~/hooks/use-current-path";
import { appNav, userNav } from "~/constants/navigation";
import { cn } from "~/utils/cn";
import { supabase } from "~/server/supabase/supabaseClient";
import { Button } from "~/components/ui/button";
import { useAppParams } from "~/hooks/use-app-params";
import { DoorOpenIcon } from "lucide-react";

export const PageLayout = ({ children }: PropsWithChildren) => {
  const { lang } = useAppParams();

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col">{children}</div>
      <ProgressBar
        height="8px"
        color="#5434b7"
        options={{ showSpinner: true }}
        shallowRouting
        targetPreprocessor={(target) => {
          const languageCode = "/" + lang;
          let normalizedPath;
          if (target.pathname.startsWith(languageCode)) {
            normalizedPath = target.pathname;
          } else if (target.pathname === "/") {
            normalizedPath = languageCode;
          } else {
            normalizedPath = `${languageCode}${target.pathname.startsWith("/") ? "" : "/"}${target.pathname}`;
          }
          const normalizedURL = new URL(target.href);
          normalizedURL.pathname = normalizedPath;
          return normalizedURL;
        }}
      />
    </>
  );
};

PageLayout.displayName = "PageLayout";

PageLayout.Header = () => {
  const { pathWithoutLang } = useCurrentPath();
  const { user } = useUser();

  const signOut = () => {
    supabase().auth.signOut();
    redirect("/");
  };

  return (
    <Disclosure as="nav" className="border-b border-gray-200 bg-white/80 backdrop-blur-lg absolute w-full">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl bg-white px-4 backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link className="inline-block h-8 w-auto lg:hidden" href="/">
                    <StarFilledIcon className="h-8 w-auto" />
                  </Link>
                  <Link
                    className="hidden h-8 w-auto flex-row items-center gap-2 lg:flex"
                    href="/"
                  >
                    <StarFilledIcon className="h-8 w-auto" />
                  </Link>
                </div>
                <HeaderDesktop />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <>
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white text-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <Image
                            height={32}
                            width={32}
                            className="h-8 w-8 rounded-full"
                            src={user?.user_metadata?.avatar_url ?? ""}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-[200px] origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNav.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  href={item.href}
                                  className={cn(
                                    active ? "bg-gray-100" : "",
                                    "flex flex-row gap-2 items-center px-4 py-2 text-md text-slate-800",
                                  )}
                                >
                                  <item.icon className="h-4 w-4" />
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                          <Menu.Item>
                            <Link
                              href="#"
                              className="flex flex-row gap-2 items-center px-4 py-2 text-md text-gray-700"
                              onClick={signOut}
                            >
                              <DoorOpenIcon className="h-4 w-4" />
                              Sign out
                            </Link>
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  <div>
                    <Button asChild className="w-full">
                      <Link href="/login" className="w-full text-md">
                        Login
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {appNav.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  className={cn(
                    item.href === pathWithoutLang
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                    "block w-full border-l-4 py-2 pl-3 pr-4 text-base font-medium",
                  )}
                  aria-current={
                    item.href === pathWithoutLang ? "page" : undefined
                  }
                >
                  <Link className="block w-full text-left" href={item.href}>
                    {item.name}
                  </Link>
                </Disclosure.Button>
              ))}
            </div>
            {user ? (
              <div className="pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Image
                      width={32}
                      height={32}
                      className="h-10 w-10 rounded-full"
                      src={user.user_metadata?.avatar_url ?? ""}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.user_metadata?.full_name ?? user?.email}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {userNav.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      className="flex flex-row gap-2 items-center w-full px-4 py-2 text-left text-md font-medium text-slate-800 hover:bg-gray-100 hover:text-gray-800"
                    >
                      <item.icon className="h-4 w-4" />
                      <Link href={item.href}>{item.name}</Link>
                    </Disclosure.Button>
                  ))}
                  <Disclosure.Button
                    onClick={signOut}
                    className="flex flex-row gap-2 items-center w-full px-4 py-2 text-left text-md font-medium text-slate-800 hover:bg-gray-100 hover:text-gray-800"
                  >
                    <DoorOpenIcon className="h-4 w-4" />
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            ) : (
              <Disclosure.Button className="mb-2 block w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                <Button className="w-full" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </Disclosure.Button>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

PageLayout.Body = ({ children }: PropsWithChildren) => (
  <div className="flex-1 overflow-y-auto mt-16">
    <main>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
    </main>
  </div>
);

PageLayout.Footer = ({ children }: PropsWithChildren) => (
  <footer className="w-full border-t border-gray-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center">
        <div className="flex w-full flex-row justify-between gap-2">
          {children}
        </div>
      </div>
    </div>
  </footer>
);
