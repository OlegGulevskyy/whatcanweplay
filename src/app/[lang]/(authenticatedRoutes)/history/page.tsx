import { redirect } from "next/navigation";
import { HistoryView } from "~/components/history";
import { LOGIN_ROUTE_PATH } from "~/constants/navigation";
import { getServerUser } from "~/utils/auth";

export const metadata = {
  title: "What Can We Play - My games",
  description: "View What Can We Play Generated games history",
};

const HistoryPage = async () => {
  const { user } = await getServerUser();
  if (!user) {
    redirect(LOGIN_ROUTE_PATH);
  }

  return <HistoryView />;
};

export default HistoryPage;
