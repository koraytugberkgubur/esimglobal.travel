import { countryPages } from "./countryPages";
import { francePlans } from "./france/plans";

// Keep previews tied to the same editorial records as the full country pages.
// Only send the compact, existing comparison summaries to the interactive map.
export const mapGuideSummaries = Object.fromEntries([
  ["france", {
    heroSummary: "Compare prepaid France eSIM plans for Paris, Lyon, Nice and travel between regions.",
    networks: "Orange, SFR, Bouygues Telecom and Free Mobile operate nationwide networks.",
    coverage: "4G is widely available; 5G depends on location and the selected plan.",
    sourceChecked: "2026-08-24", plans: francePlans,
  }],
  ...Object.entries(countryPages).filter(([, destination]) => destination.availability !== "unverified"),
].map(([slug, destination]) => {
  const plan = destination.plans.find((item) => Number.isFinite(item.price));
  return [slug, { summary: destination.heroSummary, networks: destination.networks, coverage: destination.coverage,
    sourceChecked: destination.sourceChecked,
    offer: plan ? { brand: plan.brand, dataLabel: plan.dataLabel, daysLabel: plan.daysLabel, price: plan.price } : null,
  }];
}));
