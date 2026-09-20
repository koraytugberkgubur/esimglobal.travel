"use client";

import { useState } from "react";
import { HeadingReadMore, HeadingSignal } from "./EditorialHeading";

const criteria = [
  {
    label: "Start with coverage",
    short: "Country and network fit",
    title: "Confirm the eSIM works everywhere on your itinerary.",
    text: "The best eSIM is the one that connects to reliable local networks in every country you plan to visit. Check the complete coverage list rather than relying on a broad region name.",
    checks: ["Every destination is included", "Local network partners are listed", "4G or 5G availability is clear"],
    comparisons: [
      { brand: "Saily", product: "Global", metric: "121 destinations", detail: "Widest listed worldwide coverage", color: "#3626a7" },
      { brand: "Airalo", product: "Eurolink", metric: "42 countries", detail: "Broadest listed Europe coverage", color: "#ff6b4a" },
      { brand: "Holafly", product: "Europe Unlimited", metric: "33 countries", detail: "Multi-country unlimited data", color: "#7b2dff" },
    ],
    tip: "For a multi-country trip, one regional or global eSIM is usually easier than installing separate country plans. Tiered global, regional and local options make it simpler to match coverage to your route.",
  },
  {
    label: "Match the trip length",
    short: "Validity and activation",
    title: "Line up plan validity with your complete itinerary.",
    text: "Short plans suit brief holidays, while longer validity reduces repeated purchases during extended travel. Buying one plan that spans the whole trip is simpler than stacking several short ones.",
    checks: ["Validity periods range from 7 to 365 days", "Longer plans reduce repeat purchases", "Activation can be timed to your arrival date"],
    comparisons: [
      { brand: "Saily", product: "Global short trip", metric: "1 GB / 7 days", detail: "Sized for a brief holiday", color: "#3626a7" },
      { brand: "Saily", product: "Global long stay", metric: "50 GB / 365 days", detail: "Built for frequent travelers", color: "#3626a7" },
      { brand: "Holafly", product: "Flexible unlimited", metric: "Unlimited / 7 days", detail: "Check the selected duration", color: "#7b2dff" },
    ],
    tip: "A 30-day plan can offer better value than stacking several short plans, even for a two-week trip. A range from 7 to 365 days covers nearly every itinerary length.",
  },
  {
    label: "Estimate your data",
    short: "GB, unlimited and speed",
    title: "Match your allowance to how you will actually use your phone.",
    text: "Navigation and messaging require far less data than streaming, video calls, and hotspot use. Estimating daily consumption before buying prevents both overpaying and running out mid-trip.",
    checks: ["1–3 GB suits light, message-first use", "5–10 GB suits regular navigation and social media", "20 GB or unlimited suits streaming and hotspot use"],
    comparisons: [
      { brand: "Saily", product: "Global light", metric: "1–3 GB", detail: "Messaging and maps", color: "#3626a7" },
      { brand: "Saily", product: "Global regular", metric: "5–10 GB", detail: "Daily navigation and social", color: "#3626a7" },
      { brand: "Holafly", product: "Europe Unlimited", metric: "Unlimited / 7 days", detail: "Streaming and hotspot use", color: "#7b2dff" },
    ],
    tip: "Most travelers use 3–5 GB per week; video calls and hotspot use can increase that quickly, so it is worth sizing up if in doubt.",
  },
  {
    label: "Check plan features",
    short: "Hotspot, support and security",
    title: "Look past the price tag to what the plan actually includes.",
    text: "Connectivity requirements go beyond raw data, including hotspot access, activation rules, support, and security tools, all of which affect how usable a plan is in practice. These features often separate a good plan from a merely cheap one.",
    checks: ["Hotspot sharing is confirmed where needed", "Activation happens digitally before departure", "Support and security tools are included"],
    comparisons: [
      { brand: "Saily", product: "Global", metric: "Web protection", detail: "Ad blocking and virtual location", color: "#3626a7" },
      { brand: "Saily", product: "Global", metric: "24-hour support", detail: "Included on most plans", color: "#3626a7" },
      { brand: "Airalo", product: "Eurolink", metric: "Top-ups", detail: "Extend data when needed", color: "#ff6b4a" },
    ],
    tip: "Keep your primary SIM active for verification texts, but disable its data roaming to avoid extra charges.",
  },
  {
    label: "Compare total value",
    short: "Value, not headline price",
    title: "Judge plans by total value, not headline price.",
    text: "Data allowance, validity, coverage, and included features all determine the practical cost of a plan. The lowest sticker price is not always the best deal once these factors are weighed together.",
    checks: ["Price per GB reveals the real cost", "Daily cost makes short trips easy to compare", "Coverage value rises for multi-country routes"],
    comparisons: [
      { brand: "Saily", product: "Destination package", metric: "Match GB and validity", detail: "Review the checked country price", color: "#3626a7" },
      { brand: "Airalo", product: "Destination package", metric: "Use the same currency", detail: "Compare equivalent package totals", color: "#ff6b4a" },
      { brand: "Holafly", product: "Unlimited package", metric: "Match your trip duration", detail: "Check the full-duration total", color: "#7b2dff" },
    ],
    tip: "Use the coverage, length and data checks above alongside this value check to land on the plan that fits your actual trip, not just the lowest number on the page.",
  },
];

export default function EsimGuide() {
  const [active, setActive] = useState(0);

  function handleTabKeyDown(event, index) {
    const lastIndex = criteria.length - 1;
    const nextIndex = event.key === "ArrowDown" || event.key === "ArrowRight"
      ? (index + 1) % criteria.length
      : event.key === "ArrowUp" || event.key === "ArrowLeft"
        ? (index - 1 + criteria.length) % criteria.length
        : event.key === "Home" ? 0 : event.key === "End" ? lastIndex : null;
    if (nextIndex === null) return;
    event.preventDefault();
    setActive(nextIndex);
    requestAnimationFrame(() => document.getElementById(`guide-tab-${nextIndex}`)?.focus());
  }

  return (
    <section className="esimGuide" aria-labelledby="guide-title">
      <header className="guideHeading">
        <div>
          <p className="routeKicker">TRAVEL ESIM BUYER’S GUIDE</p>
          <h2 id="guide-title"><HeadingSignal />How to choose the best eSIM for your trip</h2>
          <HeadingReadMore href="#guide-checks" label="Start the checks">The best eSIM depends on destination coverage, trip length, data consumption, plan features and total value. Coverage comes first, because an inexpensive plan has limited value outside its supported network.</HeadingReadMore>
        </div>
        <span className="headingMetric">05 decision checks · side-by-side examples</span>
      </header>

      <div className="guideSwitcher" id="guide-checks">
        <div className="guideTabs" role="tablist" aria-orientation="vertical" aria-label="eSIM selection criteria">
          {criteria.map((item, index) => (
            <button
              key={item.label}
              id={`guide-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls={`guide-panel-${index}`}
              className={active === index ? "active" : ""}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              <small>{item.short}</small>
              <i aria-hidden="true">⌁</i>
            </button>
          ))}
        </div>

        <div className="guidePanels">
          {criteria.map((item, index) => (
            <article
              key={item.title}
              id={`guide-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`guide-tab-${index}`}
              hidden={active !== index}
              className="guidePanel"
            >
              <div className="guidePanelNumber" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
              <p className="guideKicker">Decision check / {item.short}</p>
              <h3>{item.title}</h3>
              <p className="guideText">{item.text}</p>
              <ul>
                {item.checks.map((check) => <li key={check}><span aria-hidden="true">✓</span>{check}</li>)}
              </ul>
              <section className="guideComparison" aria-labelledby={`guide-comparison-${index}`}>
                <header><h4 id={`guide-comparison-${index}`}>Suggested comparison</h4><span>Example plans · verify live prices</span></header>
                <ol>
                  {item.comparisons.map((comparison, comparisonIndex) => (
                    <li key={comparison.brand}><article style={{ "--comparison-color": comparison.color }}>
                      <span className="comparisonRank">0{comparisonIndex + 1}</span>
                      <div><strong><i />{comparison.brand}</strong><small>{comparison.product}</small></div>
                      <div><b>{comparison.metric}</b><small>{comparison.detail}</small></div>
                    </article></li>
                  ))}
                </ol>
              </section>
              <aside><strong>Traveler note</strong><p>{item.tip}</p></aside>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
