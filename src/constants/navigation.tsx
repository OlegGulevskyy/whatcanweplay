import { MagicWandIcon } from "@radix-ui/react-icons";

const SETTINGS_ROUTE_PATH = "/settings";
const HISTORY_ROUTE_PATH = "/history";
const SEND_MESSAGE_ROUTE_PATH = "/send-message";

export const appNav = [
  {
    name: "Play",
    href: "/play",
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
