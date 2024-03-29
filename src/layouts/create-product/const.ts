import type { Step } from "~/components/stepper";
import {
  CREATE_PRODUCT_ADDRESS_PATH,
  CREATE_PRODUCT_DESCRIBE_PATH,
  CREATE_PRODUCT_PHOTO_PATH,
  CREATE_PRODUCT_TITLE_PATH,
} from "~/constants/navigation";

export const STEPS_TO_CREATE: Step[] = [
  {
    name: "What do you sell",
    status: "upcoming",
    href: CREATE_PRODUCT_TITLE_PATH,
  },
  {
    name: "Describe it",
    status: "upcoming",
    href: CREATE_PRODUCT_DESCRIBE_PATH,
  },
  {
    name: "Photo",
    status: "upcoming",
    href: CREATE_PRODUCT_PHOTO_PATH,
  },
  {
    name: "Address",
    status: "upcoming",
    href: CREATE_PRODUCT_ADDRESS_PATH,
  },
];
