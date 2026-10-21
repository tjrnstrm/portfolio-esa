import Link from "next/link";
import type { ComponentProps } from "react";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** Internal link. Route changes animate through the root template's
 *  ViewTransition, and the music player lives above the template, so the
 *  chosen track keeps playing across pages without any help from here. */
export default function TransitionLink(props: TransitionLinkProps) {
  return <Link {...props} />;
}
