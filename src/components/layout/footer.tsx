import { NavLink } from "@/components/ui/nav-link";
import { footerLinks } from "@/data/navigation";

type FooterProps = {
  variant?: "inline" | "stacked";
};

export function Footer({ variant = "inline" }: FooterProps) {
  return (
    <footer className="bg-background border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center py-stack-lg px-margin-desktop w-full max-w-container-max mx-auto gap-4 text-center md:text-left">
        {variant === "inline" ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-label-md text-primary shrink-0">FarmCast</span>
            <span className="text-body-sm text-on-surface-variant">
              FarmCast AI Intelligence • Data Source: Global Met Grid • Last
              Sync: 2 mins ago
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-label-md text-primary">
              FarmCast AI Intelligence
            </span>
            <p className="text-body-sm text-on-surface-variant">
              Data Source: Global Met Grid • Last Sync: 2 mins ago
            </p>
          </div>
        )}
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {footerLinks.map((link) => (
            <NavLink
              key={link.label}
              href={link.href}
              className="text-body-sm text-on-surface-variant hover:text-on-surface border-none pb-0"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}
