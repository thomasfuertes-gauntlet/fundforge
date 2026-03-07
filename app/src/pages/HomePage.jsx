import { Link } from "react-router-dom";
import { usePageView } from "@/lib/useAnalytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, LayoutGrid, User, ArrowRight } from "lucide-react";

const PAGES = [
  { to: "/campaign/campaign-1", label: "Campaign", icon: Flame },
  { to: "/community", label: "Community", icon: LayoutGrid },
  { to: "/profile/profile-1", label: "Profile", icon: User },
];

export default function HomePage() {
  usePageView("home");

  return (
    <div className="min-h-[80vh] bg-background">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-32">
        <Badge variant="secondary" className="mb-4">
          Interview project
        </Badge>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Crowdfunding built on{" "}
          <span className="text-primary">trust</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          FundForge is a GoFundMe-inspired prototype exploring how trust
          signals, social proof, and behavioral economics can improve
          crowdfunding experiences.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {PAGES.map(({ to, label, icon: Icon }) => (
            <Button key={to} asChild variant="outline" size="lg">
              <Link to={to}>
                <Icon className="h-5 w-5" />
                {label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
