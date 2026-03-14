import { useState, useEffect } from "react";
import { visitorId, ab } from "@/lib/ab";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePageView } from "@/lib/useAnalytics";
import { BarChart3, FlaskConical, Users, TrendingUp, Fingerprint } from "lucide-react";

// Normal CDF via error function approximation (Abramowitz & Stegun)
function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327;
  const p =
    d *
    Math.exp((-x * x) / 2) *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.8212560 + t * 1.3302744))));
  return x > 0 ? 1 - p : p;
}

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

// Ordered funnel steps - each step's conv rate is relative to the previous step
const FUNNEL_ORDER = ['impression', 'scroll_depth', 'donate_click', 'donate_complete', 'share_click'];
const STEP_LABELS = {
  impression: 'Impressions',
  scroll_depth: 'Engaged (scroll)',
  donate_click: 'Donate clicked',
  donate_complete: 'Donated',
  share_click: 'Shared',
};

function reshapeResults(rows, totalVisitors) {
  const map = {};
  for (const r of rows) {
    if (!map[r.experiment]) map[r.experiment] = {};
    const key = `${r.variation}_${r.event_type}`;
    map[r.experiment][key] = r.unique_visitors;
  }

  return Object.entries(map).map(([name, d]) => {
    // Build funnel steps with data
    const steps = FUNNEL_ORDER
      .filter((step) => d[`control_${step}`] || d[`treatment_${step}`])
      .map((step, i, arr) => {
        const cCount = d[`control_${step}`] || 0;
        const tCount = d[`treatment_${step}`] || 0;
        const prevStep = i > 0 ? arr[i - 1] : null;
        const cPrev = prevStep ? (d[`control_${prevStep}`] || 0) : totalVisitors;
        const tPrev = prevStep ? (d[`treatment_${prevStep}`] || 0) : totalVisitors;
        return {
          step,
          label: STEP_LABELS[step] || step,
          control: { count: cCount, rate: cPrev > 0 ? cCount / cPrev : 0 },
          treatment: { count: tCount, rate: tPrev > 0 ? tCount / tPrev : 0 },
        };
      });

    // Overall conversion: donate_complete / impression
    const cImp = d.control_impression || 0;
    const cConv = d.control_donate_complete || 0;
    const tImp = d.treatment_impression || 0;
    const tConv = d.treatment_donate_complete || 0;
    const cRate = cImp > 0 ? cConv / cImp : 0;
    const tRate = tImp > 0 ? tConv / tImp : 0;
    const lift = cRate > 0 ? (tRate - cRate) / cRate : 0;

    return {
      name,
      steps,
      totalVisitors: cImp + tImp,
      overall: { cRate, tRate, lift, pWin: pWin(cConv, cImp, tConv, tImp) },
    };
  });
}

function pct(n) {
  return (n * 100).toFixed(1) + "%";
}

export default function DashboardPage() {
  usePageView("dashboard");
  const [experiments, setExperiments] = useState([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ab/results")
      .then((r) => r.json())
      .then((data) => {
        setTotalVisitors(data.totalVisitors);
        setExperiments(reshapeResults(data.rows, data.totalVisitors));
      })
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
          Live experiment results from D1. {totalVisitors > 0 && (
            <span className="font-medium text-foreground">{totalVisitors.toLocaleString()} unique visitors tracked.</span>
          )}
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
                    <Badge variant="secondary" className="rounded-full">
                      <Users className="h-3 w-3 mr-1" />
                      {exp.totalVisitors.toLocaleString()} visitors
                    </Badge>
                  </div>

                  {/* Funnel Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/40">
                          <th className="text-left py-2 pr-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">Step</th>
                          <th className="text-right py-2 px-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Control</th>
                          <th className="text-right py-2 px-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Conv %</th>
                          <th className="text-right py-2 px-3 text-xs font-medium uppercase tracking-widest text-primary/70">Treatment</th>
                          <th className="text-right py-2 pl-3 text-xs font-medium uppercase tracking-widest text-primary/70">Conv %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exp.steps.map((s, i) => (
                          <tr key={s.step} className={i < exp.steps.length - 1 ? "border-b border-border/20" : ""}>
                            <td className="py-2.5 pr-4 text-muted-foreground">{s.label}</td>
                            <td className="py-2.5 px-3 text-right font-medium text-foreground">{s.control.count.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-right text-muted-foreground">
                              {i === 0 ? "-" : pct(s.control.rate)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-medium text-foreground">{s.treatment.count.toLocaleString()}</td>
                            <td className="py-2.5 pl-3 text-right text-muted-foreground">
                              {i === 0 ? "-" : pct(s.treatment.rate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Overall Stats */}
                  <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-muted-foreground">Overall conv:</span>
                      <span className="text-sm font-medium text-foreground">{pct(exp.overall.cRate)} → {pct(exp.overall.tRate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-primary/60" />
                      <span className="text-sm text-muted-foreground">Lift:</span>
                      <span className={`text-sm font-semibold ${exp.overall.lift > 0 ? "text-green-700" : exp.overall.lift < 0 ? "text-red-700" : "text-foreground"}`}>
                        {exp.overall.lift > 0 ? "+" : ""}{pct(exp.overall.lift)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4 text-primary/60" />
                      <span className="text-sm text-muted-foreground">P(treatment wins):</span>
                      <span className="text-sm font-semibold text-foreground">{pct(exp.overall.pWin)}</span>
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
