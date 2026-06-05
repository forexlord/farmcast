"use client";

import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { NavLink } from "@/components/ui/nav-link";
import { isNavActive, navItems, profileImage } from "@/data/navigation";
import Image from "next/image";
import { useState } from "react";

type HeaderProps = {
  pathname: string;
  variant?: "full" | "compact";
  fixed?: boolean;
  onLocationSearch?: (query: string) => void;
  onUseMyLocation?: () => void;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
};

export function Header({
  pathname,
  variant = "full",
  fixed = variant === "compact",
  onLocationSearch,
  onUseMyLocation,
  searchValue,
  onSearchValueChange,
}: HeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  function submitSearch() {
    if (searchValue?.trim() && onLocationSearch) {
      onLocationSearch(searchValue.trim());
      setMobileSearchOpen(false);
    }
  }

  return (
    <header
      className={
        fixed
          ? "bg-surface-container border-b border-outline-variant fixed top-0 w-full z-50 overflow-x-hidden"
          : "bg-surface-container border-b border-outline-variant sticky top-0 z-50 overflow-x-hidden"
      }
    >
      <div className="relative flex justify-between items-center w-full min-w-0 px-margin-desktop h-14 md:h-16 max-w-container-max mx-auto gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-8 min-w-0">
          <Logo className="h-6 sm:h-7 md:h-8 w-auto shrink-0" />
          <nav className="hidden md:flex gap-4 lg:gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                active={isNavActive(item.href, pathname)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <MobileNav pathname={pathname} />
        </div>

        {variant === "full" && (
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-4">
            <Input
              icon="search"
              placeholder="Search field location..."
              aria-label="Search field location"
              value={searchValue}
              onChange={(event) => onSearchValueChange?.(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitSearch();
              }}
            />
            <Button
              variant="icon"
              aria-label="Use my location"
              onClick={onUseMyLocation}
            >
              <Icon name="my_location" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
          {variant === "full" && (
            <>
              <Button
                variant="icon"
                className="lg:hidden"
                aria-label="Search location"
                aria-expanded={mobileSearchOpen}
                onClick={() => setMobileSearchOpen((open) => !open)}
              >
                <Icon name="search" />
              </Button>
              <Button
                variant="icon"
                className="lg:hidden"
                aria-label="Use my location"
                onClick={onUseMyLocation}
              >
                <Icon name="my_location" />
              </Button>
            </>
          )}
          {variant === "compact" && (
            <Button
              variant="icon"
              aria-label="Use my location"
              onClick={onUseMyLocation}
            >
              <Icon name="my_location" />
            </Button>
          )}
          <div
            className={
              variant === "compact"
                ? "h-8 w-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline relative"
                : "w-8 h-8 md:w-10 md:h-10 rounded-full border border-outline-variant overflow-hidden relative"
            }
          >
            <Image
              src={profileImage}
              alt="User profile"
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        </div>
      </div>

      {variant === "full" && mobileSearchOpen && (
        <div className="lg:hidden px-margin-desktop pb-3 flex gap-2 min-w-0">
          <Input
            icon="search"
            placeholder="Search field location..."
            aria-label="Search field location"
            value={searchValue}
            onChange={(event) => onSearchValueChange?.(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitSearch();
            }}
            className="flex-1"
          />
          <Button onClick={submitSearch} className="shrink-0">
            Go
          </Button>
        </div>
      )}
    </header>
  );
}
