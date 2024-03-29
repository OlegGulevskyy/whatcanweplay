import {
  BuildingStorefrontIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { MessageCircleIcon } from "lucide-react";

const SETTINGS_ROUTE_PATH = "/settings";

export const appNav = [
  { name: "Home", href: "/#", icon: HomeIcon, isHome: true },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageCircleIcon,
    isProtected: true,
  },
  {
    name: "Products",
    href: "/products",
    icon: BuildingStorefrontIcon,
    isProtected: true,
  },
  {
    name: "Profile",
    href: "/settings/profile",
    icon: UserIcon,
    isProtected: true,
  },
];

export const userNav = [{ name: "Settings", href: SETTINGS_ROUTE_PATH }];

export const POST_PRODUCT_PATH = "/products/new";

export const settingsNav = [
  { name: "General", href: SETTINGS_ROUTE_PATH + "/general" },
  { name: "Profile", href: SETTINGS_ROUTE_PATH + "/profile" },
  { name: "Billing", href: SETTINGS_ROUTE_PATH + "/billing" },
];

export const CREATE_PRODUCT_PATH = "/products/new";
export const CREATE_PRODUCT_TITLE_PATH = CREATE_PRODUCT_PATH + "/title";
export const CREATE_PRODUCT_DESCRIBE_PATH = CREATE_PRODUCT_PATH + "/describe";
export const CREATE_PRODUCT_PHOTO_PATH = CREATE_PRODUCT_PATH + "/photo";
export const CREATE_PRODUCT_ADDRESS_PATH = CREATE_PRODUCT_PATH + "/address";
