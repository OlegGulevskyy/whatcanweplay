import { useCurrentPath } from "~/hooks/use-current-path";
import { STEPS_TO_CREATE } from "./const";

export const getNextStepHref = () => {
  const currentStep = getCurrentStep();
  if (!currentStep) return;

  const currentStepIndex = STEPS_TO_CREATE.indexOf(currentStep);
  return STEPS_TO_CREATE[currentStepIndex + 1]?.href;
};

export const getCurrentStep = () => {
  const { pathWithoutLang } = useCurrentPath();
  return STEPS_TO_CREATE.find((s) => s.href === pathWithoutLang);
};
