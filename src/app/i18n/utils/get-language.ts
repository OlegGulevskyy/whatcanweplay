import { fallbackLng, languages } from "../settings";

export const getLanguage = (lng?: string): string => {
  if (languages.indexOf(lng as string) === -1) {
    return fallbackLng;
  }

  if (!lng) {
    return fallbackLng;
  }

  return lng;
};
