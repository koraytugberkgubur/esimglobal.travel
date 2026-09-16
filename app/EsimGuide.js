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
      { brand: "Airalo", product: "Eurolink", metric: "42 countries", detail: "Broadest listed Europe coverage", color: "#ff6b4a" },
      { brand: "Saily", product: "Europe", metric: "35 countries", detail: "Coverage plus security tools", color: "#3626a7" },
      { brand: "Holafly", product: "Europe Unlimited", metric: "33 countries", detail: "Multi-country unlimited data", color: "#7b2dff" },
    ],
    tip: "For a multi-country trip, one regional eSIM is usually easier than installing separate country plans.",
  },
  {
    label: "Match the trip length",
    short: "Validity and activation",
    title: "Choose validity that covers the entire journey.",
    text: "Plan validity may begin at installation, purchase, or first network connection. Select a duration that includes your arrival and departure days, then verify the provider’s activation policy.",
    checks: ["Validity exceeds the trip length", "Activation timing is understood", "A top-up option is available if needed"],
    comparisons: [
      { brand: "Saily", product: "Short trip", metric: "1 GB / 7 days", detail: "Check the destination package", color: "#3626a7" },
      { brand: "Airalo", product: "Eurolink", metric: "3 GB / 30 days", detail: "Check the regional package", color: "#ff6b4a" },
      { brand: "Holafly", product: "Flexible unlimited", metric: "Unlimited / 7 days", detail: "Check the selected duration", color: "#7b2dff" },
    ],
    tip: "A 30-day plan can offer better value than stacking several short plans, even for a two-week trip.",
  },
  {
    label: "Estimate your data",
    short: "GB, unlimited and speed",
    title: "Pay for the data you will realistically use.",
    text: "Light navigation and messaging use far less data than video, tethering, or remote work. Compare fixed-data plans by price per gigabyte and read the fair-use policy behind unlimited plans.",
    checks: ["Allowance fits your usage", "Unlimited speed limits are disclosed", "Usage tracking is available"],
    comparisons: [
      { brand: "Airalo", product: "Eurolink", metric: "5 GB / 30 days", detail: "Fixed-data option", color: "#ff6b4a" },
      { brand: "Saily", product: "Europe", metric: "10 GB / 30 days", detail: "For regular daily use", color: "#3626a7" },
      { brand: "Holafly", product: "Europe Unlimited", metric: "Unlimited / 7 days", detail: "For heavy data use", color: "#7b2dff" },
    ],
    tip: "Most travelers use 3–5 GB per week; video calls and hotspot use can increase that quickly.",
  },
  {
    label: "Check plan features",
    short: "Hotspot, calls and security",
    title: "Look beyond the headline data allowance.",
    text: "Travel eSIMs are often data-only. If you need hotspot sharing, calls, SMS, a local number, privacy tools, or top-ups, confirm that the selected product includes them before checkout.",
    checks: ["Hotspot rules suit your devices", "Calls and SMS needs are covered", "Installation support is available"],
    comparisons: [
      { brand: "Saily", product: "Europe", metric: "Web protection", detail: "Security-focused choice", color: "#3626a7" },
      { brand: "Airalo", product: "Eurolink", metric: "Top-ups", detail: "Extend data when needed", color: "#ff6b4a" },
      { brand: "Holafly", product: "Europe Unlimited", metric: "Daily hotspot", detail: "Check sharing allowance", color: "#7b2dff" },
    ],
    tip: "Keep your primary SIM active for verification texts, but disable its data roaming to avoid extra charges.",
  },
  {
    label: "Compare total value",
    short: "Price, support and trust",
    title: "The cheapest plan is not always the best-value eSIM.",
    text: "Compare the final price alongside coverage, allowance, validity, network quality, refund terms, and customer support. A slightly higher price can be worthwhile when it removes uncertainty during travel.",
    checks: ["Final price and taxes are visible", "Refund terms are understandable", "The provider offers responsive support"],
    comparisons: [
      { brand: "Saily", product: "Destination package", metric: "Match GB and validity", detail: "Review the checked country price", color: "#3626a7" },
      { brand: "Airalo", product: "Destination package", metric: "Use the same currency", detail: "Compare equivalent package totals", color: "#ff6b4a" },
      { brand: "Holafly", product: "Unlimited package", metric: "Match your trip duration", detail: "Check the full-duration total", color: "#7b2dff" },
    ],
    tip: "Choose a country on the map, then compare packages with the same allowance, validity and currency.",
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
          <HeadingReadMore href="#guide-checks" label="Start the checks">Use five practical checks to separate a low headline price from a plan that will actually keep you connected.</HeadingReadMore>
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
