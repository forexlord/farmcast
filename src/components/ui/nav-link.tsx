import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  active?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function NavLink({
  href,
  active,
  children,
  className,
  onClick,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-label-md transition-colors duration-200",
        active
          ? "text-primary border-b-2 border-primary pb-1"
          : "text-on-surface-variant hover:text-primary",
        className,
      )}
    >
      {children}
    </Link>
  );
}
