import { headers } from "next/headers";
import { LoginView } from "../_components/login-view";
import { getServerUser } from "~/utils/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login to WhatCanWePlay",
  description: "Login to continue using WhatCanWePlay",
};

const LoginPage = async () => {
  const h = headers();
  const referer = h.get("referer");
  const nextReferer = referer;

  const { user } = await getServerUser();

  if (user) {
    return redirect(nextReferer || "/");
  }

  return <LoginView referer={nextReferer} />;
};

export default LoginPage;
