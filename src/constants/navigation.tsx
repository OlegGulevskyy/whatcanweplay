import { MagicWandIcon } from "@radix-ui/react-icons";

export const SETTINGS_ROUTE_PATH = "/settings";
export const HISTORY_ROUTE_PATH = "/history";
export const SEND_MESSAGE_ROUTE_PATH = "/send-message";
export const PLAY_ROUTE_PATH = "/play";
export const LOGIN_ROUTE_PATH = "/login";

export const THANK_YOU_ROUTE_PATH = "/thank-you";

export const SETTINGS_BILLING_ROUTE_PATH = SETTINGS_ROUTE_PATH + "/billing";
export const SETTINGS_PROFILE_ROUTE_PATH = SETTINGS_ROUTE_PATH + "/profile";
export const SETTINGS_GENERAL_ROUTE_PATH = SETTINGS_ROUTE_PATH + "/general";

export const GAME_ROUTE_PATH = "/game";

export const getGameRoutePath = (gameId: string) =>
  GAME_ROUTE_PATH + "/" + gameId;

export const settingsNav = [
  { name: "General", href: SETTINGS_GENERAL_ROUTE_PATH },
  { name: "Profile", href: SETTINGS_PROFILE_ROUTE_PATH },
  { name: "Billing", href: SETTINGS_BILLING_ROUTE_PATH },
];

export const appNav = [
  {
    name: "Play",
    href: PLAY_ROUTE_PATH,
    icon: MagicWandIcon,
  },
];

export const userNav = [
  { name: "My games", href: HISTORY_ROUTE_PATH },
  { name: "Billing", href: SETTINGS_BILLING_ROUTE_PATH },
  { name: "Settings", href: SETTINGS_GENERAL_ROUTE_PATH },
  { name: "Send us a message", href: SEND_MESSAGE_ROUTE_PATH },
];

export const POST_PRODUCT_PATH = "/products/new";
