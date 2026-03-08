import { Users, LucideGithub, Globe } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer
      className="border-t border-border/40 bg-background/60"
      data-testid="site-footer"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-16">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          {/* Brand */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2 font-serif text-lg font-bold text-primary sm:justify-start">
              <Users className="h-5 w-5" />
              FundForge
            </div>
            <p className="text-sm text-muted-foreground">
              Built for the Gauntlet AI interview project
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/tomfuertes/gofundme-interview"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              data-testid="footer-github"
            >
              <LucideGithub className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://fundforge.tomfuertes.workers.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              data-testid="footer-live"
            >
              <Globe className="h-4 w-4" />
              Live site
            </a>
          </div>
        </div>

        {/* Tech line */}
        <div className="mt-6 border-t border-border/30 pt-5">
          <p className="text-center text-xs text-muted-foreground/70">
            React + Vite + Tailwind + Cloudflare Workers
          </p>
        </div>
      </div>
    </footer>
  );
}
