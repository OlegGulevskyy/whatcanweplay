"use client";

import Link from "next/link";
import type { PropsWithChildren } from "react";
import { settingsNav } from "~/constants/navigation";
import { useCurrentPath } from "~/hooks/use-current-path";

const SettingsLayout = ({ children }: PropsWithChildren) => {
  const { pathWithoutLang } = useCurrentPath();

  return (
    <div>
      <header className="border-b border-slate-900/5">
        <nav className="flex overflow-x-auto py-4">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
          >
            {settingsNav.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={
                    pathWithoutLang === item.href ? "text-indigo-400" : ""
                  }
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {children}
    </div>
  );
};

export default SettingsLayout;
