import { MagicWandIcon } from "@radix-ui/react-icons";

export const SETTINGS_ROUTE_PATH = "/settings";
export const HISTORY_ROUTE_PATH = "/history";
export const SEND_MESSAGE_ROUTE_PATH = "/send-message";
export const PLAY_ROUTE_PATH = "/play";
export const LOGIN_ROUTE_PATH = "/login";

export const appNav = [
  {
    name: "Play",
    href: PLAY_ROUTE_PATH,
    icon: MagicWandIcon,
  },
];

export const userNav = [
  { name: "Settings", href: SETTINGS_ROUTE_PATH },
  { name: "History", href: HISTORY_ROUTE_PATH },
  { name: "Send us a message", href: SEND_MESSAGE_ROUTE_PATH },
];

export const POST_PRODUCT_PATH = "/products/new";

export const settingsNav = [
  { name: "General", href: SETTINGS_ROUTE_PATH + "/general" },
  { name: "Profile", href: SETTINGS_ROUTE_PATH + "/profile" },
  { name: "Billing", href: SETTINGS_ROUTE_PATH + "/billing" },
];
