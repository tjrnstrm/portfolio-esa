"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import {
  PAGE_AUDIO_FADE_OUT_MS,
  PAGE_AUDIO_TRANSITION_KEY,
  PAGE_LEAVE_EVENT,
} from "./pageTransition";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** Internal link that lets page audio fade before the App Router swaps routes. */
export default function TransitionLink({
  href,
  onClick,
  scroll,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();

  const navigate = async (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    const target = new URL(href, window.location.href);
    if (target.origin !== window.location.origin) return;

    const sameDocument =
      target.pathname === window.location.pathname &&
      target.search === window.location.search;
    if (sameDocument) return;

    event.preventDefault();
    sessionStorage.setItem(PAGE_AUDIO_TRANSITION_KEY, "1");
    window.dispatchEvent(new Event(PAGE_LEAVE_EVENT));

    await new Promise((resolve) => {
      window.setTimeout(resolve, PAGE_AUDIO_FADE_OUT_MS);
    });
    router.push(`${target.pathname}${target.search}${target.hash}`, { scroll });
  };

  return <Link href={href} scroll={scroll} onClick={navigate} {...props} />;
}
