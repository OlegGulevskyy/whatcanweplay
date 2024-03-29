import { Trans } from "react-i18next/TransWithoutContext";
import { useTranslation } from "../i18n";
import { getLanguage } from "../i18n/utils/get-language";

export const metadata = {
  title: "Izeat",
};

export default async function Home({ params }: PageProps) {
  const { t } = await useTranslation(getLanguage(params.lang), "home");

  return (
    <div className="overflow-y-auto p-4 py-10">
      <h1 className="text-2xl font-semibold">Izeat Home</h1>
      <Trans t={t} i18nKey="slogan">
        <p className="mt-2">Application slogan placeholder</p>
      </Trans>
      <p className="mt-2 text-slate-400">#under_construction.</p>
    </div>
  );
}
