import { useState, useEffect } from "react";
import { visitorId, ab } from "@/lib/ab";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePageView } from "@/lib/useAnalytics";
import { BarChart3, FlaskConical, Users, TrendingUp, Fingerprint } from "lucide-react";

// Normal CDF via error function approximation (Abramowitz & Stegun)
function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327; // 1/√(2π)
  const p =
    d *
    Math.exp((-x * x) / 2) *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.8212560 + t * 1.3302744))));
  return x > 0 ? 1 - p : p;
}

// P(treatment > control) via Beta-Binomial normal approximation
function pWin(cConv, cTotal, tConv, tTotal) {
  if (cTotal === 0 || tTotal === 0) return 0.5;
  const cRate = cConv / cTotal;
  const tRate = tConv / tTotal;
  const se = Math.sqrt(
    (cRate * (1 - cRate)) / cTotal + (tRate * (1 - tRate)) / tTotal
  );
  if (se === 0) return 0.5;
  return normalCDF((tRate - cRate) / se);
}

function reshapeResults(rows) {
  const map = {};
  for (const r of rows) {
    if (!map[r.experiment]) map[r.experiment] = {};
    const key = `${r.variation}_${r.event_type}`;
    map[r.experiment][key] = r.unique_visitors;
  }
  return Object.entries(map).map(([name, d]) => {
    const cImp = d.control_impression || 0;
    const cConv = d.control_conversion || 0;
    const tImp = d.treatment_impression || 0;
    const tConv = d.treatment_conversion || 0;
    const cRate = cImp > 0 ? cConv / cImp : 0;
    const tRate = tImp > 0 ? tConv / tImp : 0;
    const lift = cRate > 0 ? (tRate - cRate) / cRate : 0;
    return {
      name,
      control: { impressions: cImp, conversions: cConv, rate: cRate },
      treatment: { impressions: tImp, conversions: tConv, rate: tRate },
      lift,
      pWin: pWin(cConv, cImp, tConv, tImp),
    };
  });
}

function pct(n) {
  return (n * 100).toFixed(1) + "%";
}

function VariationRow({ label, data, highlight }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-primary/30 bg-secondary/40" : "border-border/60 bg-muted/30"}`}>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </p>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-serif text-foreground">{data.impressions}</p>
          <p className="text-xs text-muted-foreground">visitors</p>
        </div>
        <div>
          <p className="text-2xl font-serif text-foreground">{data.conversions}</p>
          <p className="text-xs text-muted-foreground">conversions</p>
        </div>
        <div>
          <p className="text-2xl font-serif text-foreground">{pct(data.rate)}</p>
          <p className="text-xs text-muted-foreground">conv rate</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  usePageView("dashboard");
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ab/results")
      .then((r) => r.json())
      .then((rows) => setExperiments(reshapeResults(rows)))
      .catch(() => setExperiments([]))
      .finally(() => setLoading(false));
  }, []);

  const sessionBuckets = ab.getBuckets();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 md:px-12 lg:px-16">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight" data-testid="dashboard-title">
            A/B Testing Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground mb-10">
          Live experiment results from Analytics Engine + D1.
        </p>

        {/* Session Info */}
        <Card className="mb-8 border-white/70 bg-white/90" data-testid="session-info">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Fingerprint className="h-4 w-4 text-primary/60" />
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Current session
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              <span className="font-mono text-xs bg-muted/60 px-2 py-1 rounded">{visitorId}</span>
            </p>
            {Object.keys(sessionBuckets).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(sessionBuckets).map(([exp, isTreatment]) => (
                  <Badge
                    key={exp}
                    variant={isTreatment ? "default" : "secondary"}
                    className="rounded-full"
                  >
                    {exp}: {isTreatment ? "treatment" : "control"}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Browse other pages to generate experiment impressions.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Experiment Cards */}
        {loading ? (
          <p className="text-muted-foreground" data-testid="dashboard-loading">Loading results...</p>
        ) : experiments.length === 0 ? (
          <Card className="border-white/70 bg-white/90" data-testid="dashboard-empty">
            <CardContent className="p-8 text-center">
              <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">
                No experiment data yet. Browse the site to generate impressions, then donate to generate conversions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6" data-testid="experiment-cards">
            {experiments.map((exp) => (
              <Card key={exp.name} className="border-white/70 bg-white/90" data-testid={`experiment-${exp.name}`}>
                <CardContent className="p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-primary/60" />
                      <h2 className="text-lg font-semibold text-foreground">{exp.name}</h2>
                    </div>
                    <Badge
                      variant="secondary"
                      className="rounded-full"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {exp.control.impressions + exp.treatment.impressions} total
                    </Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <VariationRow label="Control" data={exp.control} />
                    <VariationRow label="Treatment" data={exp.treatment} highlight />
                  </div>

                  {/* Stats Summary */}
                  <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-primary/60" />
                      <span className="text-sm text-muted-foreground">Lift:</span>
                      <span className={`text-sm font-semibold ${exp.lift > 0 ? "text-green-700" : exp.lift < 0 ? "text-red-700" : "text-foreground"}`}>
                        {exp.lift > 0 ? "+" : ""}{pct(exp.lift)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4 text-primary/60" />
                      <span className="text-sm text-muted-foreground">P(treatment wins):</span>
                      <span className="text-sm font-semibold text-foreground">{pct(exp.pWin)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
