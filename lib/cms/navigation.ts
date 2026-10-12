import type { Navigation } from "@/types/cms";

type NavLink = NonNullable<Navigation["links"]>[number];

/** The top-menu links that are switched on in the CMS (unset counts as on). */
export function visibleLinks(links: Navigation["links"]): NavLink[] {
  return (links ?? []).filter((link) => link.visible !== false);
}
