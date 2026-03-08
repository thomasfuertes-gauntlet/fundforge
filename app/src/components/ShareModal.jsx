import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { trackShareClick } from "@/lib/analytics";
import { Link2, Mail, Send, Share2 } from "lucide-react";

const SHARE_OPTIONS = [
  {
    label: "Copy link",
    icon: Link2,
    action: (url) => {
      navigator.clipboard?.writeText(url);
      toast.success("Link copied to clipboard!");
    },
  },
  {
    label: "Twitter / X",
    icon: Send,
    action: (url, title) => {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        "_blank",
        "noopener,noreferrer"
      );
    },
  },
  {
    label: "Facebook",
    icon: Share2,
    action: (url) => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
        "noopener,noreferrer"
      );
    },
  },
  {
    label: "Email",
    icon: Mail,
    action: (url, title) => {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this campaign: ${url}`)}`;
    },
  },
];

export default function ShareModal({ open, onOpenChange, campaignId, campaignTitle }) {
  const url = `${window.location.origin}/campaign/${campaignId}`;

  function handleShare(option) {
    trackShareClick(campaignId);

    // Try Web Share API first on supported devices
    if (option.label === "Copy link" && navigator.share) {
      navigator
        .share({ title: campaignTitle, url })
        .catch(() => {
          // User cancelled or API failed - fall back to clipboard
          option.action(url, campaignTitle);
        });
      return;
    }

    option.action(url, campaignTitle);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-sm sm:rounded-2xl"
        data-testid="share-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Share this campaign</DialogTitle>
          <DialogDescription>
            Help spread the word for "{campaignTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 pt-2" data-testid="share-options">
          {SHARE_OPTIONS.map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleShare({ label, action })}
              data-testid={`share-${label.toLowerCase().replace(" ", "-")}`}
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-border bg-card px-4 py-4 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-muted/50"
            >
              <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>

        {/* URL preview */}
        <div className="mt-1 rounded-xl bg-muted/40 px-4 py-3">
          <p className="truncate text-xs text-muted-foreground">{url}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
