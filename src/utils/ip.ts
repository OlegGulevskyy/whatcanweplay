import { headers } from "next/headers";

export const getIp = () => {
  const forwardedFor = headers().get("x-forwarded-for");
  const realIp = headers().get("x-real-ip");
  console.log("forwardedFor", forwardedFor);
  console.log("realIp", realIp);

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }

  if (realIp) {
    return realIp;
  }
};
