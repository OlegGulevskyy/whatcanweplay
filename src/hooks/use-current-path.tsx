import { usePathname } from "next/navigation";
import { useAppParams } from "./use-app-params";

export const useCurrentPath = () => {
  const pathName = usePathname();
  const params = useAppParams();
  if (pathName === "/" + params.lang) {
    return {
      pathName: `/${params.lang}/`,
      pathWithoutLang: "/",
    };
  }

  const pathWithoutLang = pathName.replace(`${params.lang}/`, "");
  return {
    pathName,
    pathWithoutLang,
  };
};
