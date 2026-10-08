import { ViewTransition, type ReactNode } from "react";

/** Remounts for each route so every page inherits the same blur handoff. */
export default function RootTemplate({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-blur" exit="page-blur" default="none">
      {children}
    </ViewTransition>
  );
}
