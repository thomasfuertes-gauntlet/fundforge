import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NotFound({ type = "page" }) {
  const messages = {
    campaign: {
      title: "Campaign not found",
      description:
        "This campaign may have been removed or the link might be incorrect. Browse active campaigns in the community hub.",
    },
    profile: {
      title: "Profile not found",
      description:
        "This organizer profile doesn't exist or may have been removed. Discover other organizers in the community.",
    },
    page: {
      title: "Page not found",
      description:
        "The page you're looking for doesn't exist. Head back to explore active campaigns.",
    },
  };

  const { title, description } = messages[type] || messages.page;

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center" data-testid="not-found">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <SearchX className="h-9 w-9 text-primary/60" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg" className="rounded-full">
            <Link to="/communities/fundforge">
              Browse community
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
