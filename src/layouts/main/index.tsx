"use client";

import { Fragment, type PropsWithChildren } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

import { cn } from "~/utils/cn";
import { Button } from "~/components/ui/button";
import { supabase } from "~/server/supabase/supabaseClient";
import { POST_PRODUCT_PATH, appNav, userNav } from "~/constants/navigation";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import { HeaderDesktop } from "~/components/header-nav/desktop";
import { useAppParams } from "~/hooks/use-app-params";
import { useTranslation } from "~/app/i18n/client";
import { getLanguage } from "~/app/i18n/utils/get-language";
import { useCurrentPath } from "~/hooks/use-current-path";

export function MainLayout({ children }: PropsWithChildren) {
  const { pathWithoutLang } = useCurrentPath();
  const params = useAppParams();
  const { user } = useUser();
  const { t } = useTranslation(getLanguage(params.lang), "common");

  const signOut = () => {
    supabase().auth.signOut();
    redirect("/");
  };

  const handleResize = () => {
    const vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  if (typeof window !== "undefined") {
    handleResize();
    window.addEventListener("resize", handleResize);
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col">
        <Disclosure as="nav" className="border-b border-gray-200 bg-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <Link href="/">
                        <Image
                          height={32}
                          width={32}
                          className="block h-8 w-auto lg:hidden"
                          src="/assets/logos/Izeat_Logo_Reduced_Purple.svg"
                          alt="Izeat Logo"
                        />
                      </Link>
                      <Link href="/">
                        <Image
                          height={32}
                          width={32}
                          className="hidden h-8 w-auto lg:block"
                          src="/assets/logos/Izeat_Logo_Full_Purple.svg"
                          alt="Izeat Logo"
                        />
                      </Link>
                    </div>
                    <HeaderDesktop />
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    {/* Notification button */}
                    {user && (
                      <button
                        type="button"
                        className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    )}

                    {/* Profile dropdown */}
                    {user ? (
                      <>
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                              <span className="absolute -inset-1.5" />
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
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNav.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <Link
                                      href={item.href}
                                      className={cn(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700",
                                      )}
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                              <Menu.Item>
                                <Link
                                  href={"#"}
                                  className="block px-4 py-2 text-sm text-gray-700"
                                  onClick={signOut}
                                >
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
                          <Link href="/login" className="w-full">
                            Login
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {appNav
                    .filter((i) => (!i.isProtected ? true : user))
                    .map((item) => (
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
                        <Link
                          className="block w-full text-left"
                          href={item.href}
                        >
                          {item.name}
                        </Link>
                      </Disclosure.Button>
                    ))}
                </div>
                {user ? (
                  <div className="border-t border-gray-200 pb-3 pt-4">
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
                      <button
                        type="button"
                        className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1">
                      {userNav.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        >
                          <Link href={item.href}>{item.name}</Link>
                        </Disclosure.Button>
                      ))}
                      <Disclosure.Button
                        onClick={signOut}
                        className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
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

        <div className="flex-1 overflow-y-auto">
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>

        <footer className="w-full border-t border-gray-200 bg-white sm:hidden">
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center">
              {user ? (
                <div className="flex w-full flex-row justify-between gap-2">
                  {appNav.map((item) => (
                    <Link key={item.name} href={item.href} className="w-full">
                      <Button
                        className="flex w-full items-center gap-2"
                        variant={
                          pathWithoutLang.includes(item.href) ||
                          (item.isHome && pathWithoutLang === "/")
                            ? "default"
                            : "secondary"
                        }
                      >
                        <item.icon className="h-8 w-6" />
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mx-auto w-full">
                  <Link href={POST_PRODUCT_PATH}>
                    <Button className="w-full">{t("post_product")}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>
      <ProgressBar
        height="8px"
        color="#5434b7"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
}
