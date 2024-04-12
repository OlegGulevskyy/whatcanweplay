import { Trans } from "react-i18next/TransWithoutContext";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";

import { useTranslation } from "../i18n";
import { getLanguage } from "../i18n/utils/get-language";
import { GENERATE_GAME_ROUTE_PATH } from "~/constants/navigation";
import { MainLayout } from "~/layouts/main";

export const metadata = {
  title: "What Can We Play",
};

// TODO: translate these
const slogans = [
  {
    firstLine: "What can we play at the bar 🍺 tonight...",
    secondLine: "you thought while waiting for a Rugby match to start.",
  },
  {
    firstLine: "What can we play to spice 🌶️ the evening up...",
    secondLine: "most of us thought at our first date.",
  },
  {
    firstLine: "What can we play in the car 🚐...",
    secondLine: "this road trip feels longer than ever.",
  },
];

export default async function Home({ params }: PageProps) {
  const { t } = await useTranslation(getLanguage(params.lang), "home");

  return (
    <MainLayout>
      <div className="overflow-y-auto p-4 py-10">
        <h1 className="mb-12 inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-semibold text-transparent">
          What Can We Play?
        </h1>
        {slogans.map((sl, index) => (
          <div className="mb-8" key={index}>
            <Trans t={t} i18nKey={`slogan-${index}`}>
              <p className="mt-2 text-lg">
                <strong>{sl.firstLine}</strong>
              </p>
              <p className="italic text-slate-600">{sl.secondLine}</p>
            </Trans>
          </div>
        ))}
        <Link href={GENERATE_GAME_ROUTE_PATH}>
          <button
            type="button"
            className="inline-flex w-full items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Grab your game now!
            <ArrowRightIcon className="-mr-0.5 h-6 w-6" aria-hidden="true" />
          </button>
        </Link>
        <div className="mt-8 italic">
          <p>
            As a new user, you can{" "}
            <b className="text-indigo-600">grab up to 3 games</b> for free!
          </p>
          <p>
            You keep them <b className="text-indigo-600">forever</b>, and if you
            forget the rules - we got you covered!
          </p>
        </div>
      </div>

      <Image
        src="/assets/images/background.jpg"
        alt="background"
        width={800}
        height={800}
        className="absolute left-0 top-0 h-full w-full object-cover"
        style={{ zIndex: -1 }}
      />
    </MainLayout>
  );
}
