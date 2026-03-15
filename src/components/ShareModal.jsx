import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { trackShareClick } from "@/lib/analytics";
import { Link2, Linkedin, Mail, MessageCircle, Send, Share2, TrendingUp, Check } from "lucide-react";

const SHARE_OPTIONS = [
  {
    label: "Copy link",
    icon: Link2,
    action: (url) => {
      navigator.clipboard?.writeText(url);
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
    label: "LinkedIn",
    icon: Linkedin,
    action: (url) => {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "_blank",
        "noopener,noreferrer"
      );
    },
  },
  {
    label: "WhatsApp",
    icon: MessageCircle,
    action: (url, title) => {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
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
  const [copied, setCopied] = useState(false);

  function handleShare(option) {
    trackShareClick(campaignId);

    if (option.label === "Copy link") {
      if (navigator.share) {
        navigator.share({ title: campaignTitle, url }).catch(() => {
          option.action(url, campaignTitle);
        });
        return;
      }
      option.action(url, campaignTitle);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    option.action(url, campaignTitle);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md sm:rounded-2xl"
        data-testid="share-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Share this campaign</DialogTitle>
          <DialogDescription className="text-xs">
            Help spread the word for "{campaignTitle}"
          </DialogDescription>
        </DialogHeader>

        {/* Compact icon row */}
        <div className="flex items-center justify-between gap-1 pt-1" data-testid="share-options">
          {SHARE_OPTIONS.map(({ label, icon: Icon, action }) => {
            const isCopy = label === "Copy link";
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleShare({ label, action })}
                data-testid={`share-${label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-1 flex-col items-center gap-1.5 rounded-xl py-3 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80">
                  {isCopy && copied ? (
                    <Check className="h-4.5 w-4.5 text-primary" strokeWidth={2} />
                  ) : (
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                  )}
                </div>
                {isCopy && copied ? "Copied!" : label}
              </button>
            );
          })}
        </div>

        {/* Clickable URL bar */}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(url);
            setCopied(true);
            toast.success("Link copied!");
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
          data-testid="share-url-copy"
        >
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{url}</p>
          <span className="shrink-0 text-xs font-medium text-primary">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>

        {/* Social proof nudge */}
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5 text-primary/50" strokeWidth={1.5} />
          Each share inspires <span className="font-medium text-foreground">$50</span> in donations
        </p>
      </DialogContent>
    </Dialog>
  );
}
