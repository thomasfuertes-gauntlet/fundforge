import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-16">
        <Badge variant="secondary">Live</Badge>
        <h1 className="mt-4 text-5xl font-bold tracking-tight leading-[1.1] md:text-6xl">
          Community Hub
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Discover trending campaigns, see the leaderboard, and connect with
          fellow supporters.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {["Total Raised", "Active Campaigns", "Community Members"].map(
            (title) => (
              <Card key={title} data-testid="community-metric-card">
                <CardHeader>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold font-sans text-primary">--</p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
