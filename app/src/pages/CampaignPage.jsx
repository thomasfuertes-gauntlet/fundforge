import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function CampaignPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Badge variant="secondary" data-testid="campaign-category">
              Community Garden
            </Badge>
            <h1 className="mt-4 text-5xl font-bold tracking-tight leading-[1.1] md:text-6xl">
              Campaign {id}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Campaign story content will go here. This placeholder demonstrates
              the editorial layout with serif headings and sans-serif body text.
            </p>
          </div>

          <div className="lg:col-span-5">
            <Card className="sticky top-8" data-testid="donate-panel">
              <CardHeader>
                <CardTitle className="text-2xl">$12,450 raised</CardTitle>
                <p className="text-sm text-muted-foreground">
                  of $25,000 goal
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress value={50} data-testid="campaign-progress" />
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>142 donors</span>
                  <span>23 days left</span>
                </div>
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  data-testid="donate-button"
                >
                  Donate Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  data-testid="share-button"
                >
                  Share
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
