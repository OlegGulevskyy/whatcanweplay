import { PenIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";
import { SEND_MESSAGE_ROUTE_PATH } from "~/constants/navigation";
import { TWITTER_URL } from "~/constants/urls";

export const GetInTouchBlock = () => {
  return (
    <>
      <a
        className="mt-4 inline-flex w-full gap-2 text-indigo-700 underline underline-offset-4"
        href={TWITTER_URL}
      >
        {<TwitterIcon />}
        Twitter
      </a>
      <Link
        className="mt-4 inline-flex w-full gap-2 text-indigo-700 underline underline-offset-4"
        href={SEND_MESSAGE_ROUTE_PATH}
      >
        {<PenIcon />}
        Contact form
      </Link>
    </>
  );
};
