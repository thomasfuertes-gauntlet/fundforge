import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { trackDonateComplete } from "@/lib/analytics";

const PRESET_AMOUNTS = [25, 50, 100, 250];

export default function DonateModal({ open, onOpenChange, campaignId, campaignTitle }) {
  const [selected, setSelected] = useState(50);
  const [custom, setCustom] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const amount = isCustom ? Number(custom) || 0 : selected;

  function handlePreset(value) {
    setSelected(value);
    setIsCustom(false);
    setCustom("");
  }

  function handleCustomFocus() {
    setIsCustom(true);
  }

  function handleDonate() {
    if (amount <= 0) return;
    setSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      trackDonateComplete(campaignId, amount);
      setSubmitting(false);
      onOpenChange(false);
      toast.success(`Thank you for your $${amount.toLocaleString()} donation!`, {
        description: campaignTitle,
      });
      // Reset for next open
      setSelected(50);
      setCustom("");
      setIsCustom(false);
    }, 800);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md sm:rounded-2xl"
        data-testid="donate-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Make a donation
          </DialogTitle>
          <DialogDescription>
            Choose an amount to support this campaign.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-3" data-testid="donate-presets">
            {PRESET_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handlePreset(value)}
                data-testid={`donate-preset-${value}`}
                className={`rounded-xl border-2 px-4 py-3 text-lg font-semibold transition-all ${
                  !isCustom && selected === value
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-card text-foreground hover:border-primary/30"
                }`}
              >
                ${value}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
              $
            </span>
            <input
              type="number"
              min="1"
              placeholder="Custom amount"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setIsCustom(true);
              }}
              onFocus={handleCustomFocus}
              data-testid="donate-custom-input"
              className={`w-full rounded-xl border-2 bg-card py-3 pl-9 pr-4 text-lg font-semibold outline-none transition-all placeholder:font-normal placeholder:text-muted-foreground/60 ${
                isCustom
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-border focus:border-accent"
              }`}
            />
          </div>

          <Button
            variant="accent"
            size="lg"
            className="w-full text-base"
            disabled={amount <= 0 || submitting}
            onClick={handleDonate}
            data-testid="donate-confirm-button"
          >
            {submitting
              ? "Processing..."
              : `Donate $${amount.toLocaleString()}`}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            This is a simulated donation. No payment will be processed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
