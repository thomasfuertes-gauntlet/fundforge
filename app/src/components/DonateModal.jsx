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
import { postDonation } from "@/lib/useData";
import { Heart, Users, CheckCircle2, Share2 } from "lucide-react";

const PRESET_AMOUNTS = [25, 50, 100, 250];

function emit(type, payload = {}) {
  if (import.meta.env.DEV) {
    console.log(
      `%c[analytics] ${type}`,
      "color: #0F3C32; font-weight: bold",
      payload
    );
  }
}

export default function DonateModal({
  open,
  onOpenChange,
  campaignId,
  campaignTitle,
  averageGift,
  backerCount,
  onShare,
}) {
  const [selected, setSelected] = useState(50);
  const [custom, setCustom] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [donationComplete, setDonationComplete] = useState(false);
  const [completedAmount, setCompletedAmount] = useState(0);

  const amount = isCustom ? Number(custom) || 0 : selected;

  function handlePreset(value) {
    setSelected(value);
    setIsCustom(false);
    setCustom("");
  }

  function handleCustomFocus() {
    setIsCustom(true);
  }

  async function handleDonate() {
    if (amount <= 0) return;
    setSubmitting(true);
    // Optimistic: show success immediately, POST in background
    trackDonateComplete(campaignId, amount);
    setCompletedAmount(amount);
    setDonationComplete(true);
    setSubmitting(false);
    // Fire-and-forget POST to persist the donation
    postDonation({
      campaignId,
      donorName: "Anonymous Donor",
      amount,
      message: null,
    }).catch((err) => console.warn("[DonateModal] POST failed:", err));
  }

  function handleClose(value) {
    if (!value) {
      // Show toast on any close after donation
      if (donationComplete) {
        toast.success(`Thank you for your $${completedAmount.toLocaleString()} donation!`, {
          description: campaignTitle,
        });
      }
      // Reset all state for next open
      setSelected(50);
      setCustom("");
      setIsCustom(false);
      setDonationComplete(false);
      setCompletedAmount(0);
    }
    onOpenChange(value);
  }

  function handleShareClick() {
    emit("post_donate_action", { campaignId, action: "share" });
    handleClose(false);
    if (onShare) onShare();
  }

  function handleDismiss() {
    emit("post_donate_action", { campaignId, action: "dismiss" });
    handleClose(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md sm:rounded-2xl"
        data-testid="donate-modal"
      >
        {donationComplete ? (
          /* ─── Success State ─── */
          <div
            className="flex flex-col items-center gap-5 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/90 px-6 py-10 text-white -m-6"
            data-testid="donate-success"
          >
            <div className="animate-scale-in">
              <CheckCircle2 className="h-16 w-16" strokeWidth={1.5} />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-serif">Thank you!</h2>
              <p className="text-lg text-white/80">
                Your ${completedAmount.toLocaleString()} donation makes a difference
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 pt-2">
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={handleShareClick}
                data-testid="post-donate-share"
              >
                <Share2 className="h-5 w-5" />
                Share your donation
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full text-white/80 hover:bg-white/10 hover:text-white"
                onClick={handleDismiss}
                data-testid="post-donate-dismiss"
              >
                Back to campaign
              </Button>
            </div>
          </div>
        ) : (
          /* ─── Donation Form ─── */
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Make a donation
              </DialogTitle>
              <DialogDescription>
                Choose an amount to support this campaign.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-2">
              {/* Anchoring + Social Proof */}
              <div className="space-y-1.5">
                {averageGift > 0 && (
                  <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground" data-testid="donate-anchoring">
                    <Heart className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Most donors give ${averageGift.toLocaleString()}
                  </p>
                )}
                {backerCount > 0 && (
                  <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground" data-testid="donate-social-proof">
                    <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {backerCount.toLocaleString()} people have donated
                  </p>
                )}
              </div>

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
                  aria-label="Custom donation amount"
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
