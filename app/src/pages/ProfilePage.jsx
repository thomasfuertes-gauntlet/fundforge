import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ProfilePage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-16">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20" data-testid="profile-avatar">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback className="text-2xl">U{id}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              User Profile
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              Member since 2024
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card data-testid="trust-score-card">
            <CardHeader>
              <CardTitle className="text-lg">Trust Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-sans text-primary">
                  85
                </span>
                <Badge variant="secondary">Verified</Badge>
              </div>
              <Progress value={85} />
            </CardContent>
          </Card>

          <Card data-testid="profile-stats-card">
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold font-sans text-primary">3</p>
                  <p className="text-sm text-muted-foreground">Campaigns</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-sans text-primary">
                    $2,450
                  </p>
                  <p className="text-sm text-muted-foreground">Total Raised</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
