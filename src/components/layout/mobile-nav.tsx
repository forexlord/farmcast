"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { NavLink } from "@/components/ui/nav-link";
import { isNavActive, navItems } from "@/data/navigation";
import { useState } from "react";

type MobileNavProps = {
  pathname: string;
};

export function MobileNav({ pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="icon"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <Icon name={open ? "close" : "menu"} />
      </Button>
      {open && (
        <nav className="absolute top-16 inset-x-0 bg-surface-container border-b border-outline-variant px-4 py-3 flex flex-col gap-1 z-50 shadow-lg">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={isNavActive(item.href, pathname)}
              className="py-2"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
