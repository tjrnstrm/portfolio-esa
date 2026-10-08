"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { useMusicPlayer } from "./hero/useMusicPlayer";

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
  const { preparePageNavigation } = useMusicPlayer();

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
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
    preparePageNavigation(target.pathname);
    router.push(`${target.pathname}${target.search}${target.hash}`, { scroll });
  };

  return <Link href={href} scroll={scroll} onClick={navigate} {...props} />;
}
