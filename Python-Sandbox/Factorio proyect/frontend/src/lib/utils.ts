/**
 * Utility: conditionally join Tailwind classes.
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
