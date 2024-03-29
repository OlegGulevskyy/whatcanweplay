"use client";

import { type PropsWithChildren, useMemo } from "react";

import { Stepper, type Step } from "~/components/stepper";
import { useCurrentPath } from "~/hooks/use-current-path";
import { STEPS_TO_CREATE } from "./const";

export const CreateProductLayout = ({ children }: PropsWithChildren) => {
  const { pathWithoutLang } = useCurrentPath();

  const steps = useMemo(() => {
    return STEPS_TO_CREATE.map((step, index) => {
      if (step.href === pathWithoutLang) {
        return { ...step, status: "current" };
      }
      if (
        index < STEPS_TO_CREATE.findIndex((s) => s.href === pathWithoutLang)
      ) {
        return { ...step, status: "complete" };
      }
      return step;
    });
  }, [pathWithoutLang]) satisfies Step[];

  return (
    <div className="px-4">
      <Stepper steps={steps} />
      {children}
    </div>
  );
};
