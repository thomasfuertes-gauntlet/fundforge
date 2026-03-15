import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedProgress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";
import { TrendingUp } from "lucide-react";

export default function CampaignCard({ campaign, testIdPrefix = "campaign" }) {
  const c = campaign;
  const progress = Math.min(Math.round((c.raised / c.goal) * 100), 100);

  return (
    <Link
      to={`/campaign/${c.id}`}
      className="block"
      data-testid={`${testIdPrefix}-${c.id}`}
    >
      <Card className="h-full overflow-hidden border-white/70 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={c.heroImage}
            alt={c.title}
            width={800}
            height={600}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <Badge className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground hover:bg-secondary">
              {c.category}
            </Badge>
            {c.weeklyMomentum > 20 && (
              <Badge className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs text-amber-900 hover:bg-amber-50">
                <TrendingUp className="mr-0.5 h-3 w-3" />
                Trending
              </Badge>
            )}
          </div>
          <p className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
            {c.title}
          </p>
          <AnimatedProgress
            value={progress}
            className="h-2 bg-primary/15"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {formatCurrency(c.raised, { compact: true })}
              {c.goal && (
                <span className="font-normal text-muted-foreground">
                  {" "}of {formatCurrency(c.goal, { compact: true })}
                </span>
              )}
            </span>
            {c.daysLeft != null && <span>{c.daysLeft} days left</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
