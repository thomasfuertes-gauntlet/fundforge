import { Link, useLocation } from "react-router-dom";
import { Flame, LayoutGrid, Users, User } from "lucide-react";

const NAV_LINKS = [
  { to: "/campaign/campaign-1", label: "Campaign", icon: Flame, match: "/campaign" },
  { to: "/community", label: "Community", icon: LayoutGrid, match: "/community" },
  { to: "/profile/profile-1", label: "Profile", icon: User, match: "/profile" },
];

export default function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header
      className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-lg"
      data-testid="site-header"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-serif text-lg font-bold text-primary transition-opacity hover:opacity-80"
          data-testid="site-logo"
        >
          <Users className="h-5 w-5" />
          FundForge
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1" data-testid="site-nav">
          {NAV_LINKS.map(({ to, label, icon: Icon, match }) => {
            const active = pathname.startsWith(match);
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                data-testid={`nav-${label.toLowerCase()}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
