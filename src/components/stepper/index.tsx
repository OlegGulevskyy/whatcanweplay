import Link from "next/link";
import { TypographyH3 } from "../typography/h3";

export type Step = {
  name: string;
  href: string;
  status: "complete" | "current" | "upcoming";
};

export function Stepper({ steps = [] }: { steps: Step[] }) {
  const [currentStep] = steps.filter((step) => step.status === "current");

  return (
    <nav
      className="flex flex-col items-center justify-center"
      aria-label="Progress"
    >
      {currentStep && <TypographyH3>{currentStep.name}</TypographyH3>}
      <ol role="list" className="mt-4 flex items-center space-x-5">
        {steps.map((step) => (
          <li key={step.name}>
            {step.status === "complete" ? (
              <Link
                href={step.href}
                className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900"
              >
                <span className="sr-only">{step.name}</span>
              </Link>
            ) : step.status === "current" ? (
              <Link
                href={currentStep?.status === "complete" ? step.href : "#"}
                className="relative flex items-center justify-center"
                aria-current="step"
              >
                <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                  <span className="h-full w-full rounded-full bg-indigo-200" />
                </span>
                <span
                  className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600"
                  aria-hidden="true"
                />
                <span className="sr-only">{step.name}</span>
              </Link>
            ) : (
              <Link
                href={currentStep?.status === "complete" ? step.href : "#"}
                className="block h-2.5 w-2.5 rounded-full bg-gray-200"
              >
                <span className="sr-only">{step.name}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
