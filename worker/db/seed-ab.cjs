// Seed A/B events with full funnel: impression → scroll_depth → donate_click → donate_complete → share_click
// Conv rates between steps are realistic for crowdfunding (~40% scroll, ~15% click, ~60% complete, ~25% share)

const lines = ['DELETE FROM ab_events;', ''];
let uid = 1;
function vid() { return `seed-${(uid++).toString(16).padStart(8, '0')}`; }
function ts() { return new Date(2026, 2, 1 + Math.random() * 13).toISOString().slice(0, 19).replace('T', ' '); }

function seedExperiment(experiment, url, controlFunnel, treatmentFunnel) {
  for (const [variation, funnel] of [['control', controlFunnel], ['treatment', treatmentFunnel]]) {
    const visitors = Array.from({ length: funnel.impression }, () => vid());
    const steps = ['impression', 'scroll_depth', 'donate_click', 'donate_complete', 'share_click'];
    let pool = [...visitors];

    for (const step of steps) {
      const count = funnel[step];
      if (!count) continue;
      // For impression, use full pool; for subsequent steps, narrow down
      const subset = step === 'impression' ? pool : pool.sort(() => Math.random() - 0.5).slice(0, count);
      for (const v of subset) {
        lines.push(`INSERT INTO ab_events (visitor_id, experiment, variation, event_type, url, timestamp) VALUES ('${v}', '${experiment}', '${variation}', '${step}', '${url}', '${ts()}');`);
      }
      if (step !== 'impression') pool = subset;
    }
  }
}

// animations experiment (campaign page)
// Story: animations help engagement + conversion. Removing them loses 28% at donate_complete.
seedExperiment('animations', '/campaign/campaign-1', {
  impression: 980,
  scroll_depth: 421,    // 43.0% of impressions
  donate_click: 72,     // 17.1% of scrolled
  donate_complete: 45,  // 62.5% of clicked → 4.6% overall
  share_click: 12,      // 26.7% of completed
}, {
  impression: 1020,
  scroll_depth: 367,    // 36.0% — less engagement without animations
  donate_click: 58,     // 15.8% of scrolled
  donate_complete: 33,  // 56.9% of clicked → 3.2% overall
  share_click: 7,       // 21.2% of completed
});

// headline-copy experiment (homepage)
// Story: "Fund with confidence" outperforms at CTA click-through, leading to more conversions
seedExperiment('headline-copy', '/', {
  impression: 1010,
  scroll_depth: 545,    // 54.0% of impressions
  donate_click: 42,     // 7.7% of scrolled (fewer reach campaign page)
  donate_complete: 26,  // 61.9% of clicked → 2.6% overall
  share_click: 8,       // 30.8% of completed
}, {
  impression: 990,
  scroll_depth: 574,    // 58.0% — better engagement
  donate_click: 61,     // 10.6% of scrolled — treatment drives more clicks
  donate_complete: 39,  // 63.9% of clicked → 3.9% overall
  share_click: 11,      // 28.2% of completed
});

console.log(lines.join('\n'));
