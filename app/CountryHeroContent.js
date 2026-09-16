"use client";
import { validityText } from "./pricePolicy";
import { usePricePresentation } from "./PriceQuote";
import { HeadingReadMore } from "./EditorialHeading";

export function HeroQuickAnswer({ country, plan, summary, reason }) {
  const { priceText, checkedText } = usePricePresentation();
  const headingId = `${country.toLowerCase().replaceAll(" ", "-")}-quick-answer`;

  return (
    <>
      <HeadingReadMore className="heroIntro" href="#plans" label="Compare plans">{summary}</HeadingReadMore>
      <section className="heroQuickAnswer" aria-labelledby={headingId}>
        <header>
          <span>Quick answer</span>
          <small>{checkedText(plan)}</small>
        </header>
        <div className="heroQuickAnswerTitle">
          <h2 id={headingId}>{country} package: {plan.brand}</h2>
          <strong>{priceText(plan)}</strong>
        </div>
        <dl aria-label={`${plan.brand} ${country} plan summary`}>
          <div><dt>Data</dt><dd>{plan.dataLabel}</dd></div>
          <div><dt>Validity</dt><dd>{validityText(plan)}</dd></div>
          <div><dt>Network</dt><dd>{plan.network}</dd></div>
        </dl>
        <p>Match this allowance, validity and currency when opening the provider’s page. Review other packages below for your trip.</p>
      </section>
      <a href="#plans">Compare {country} plans <span aria-hidden="true">↓</span></a>
    </>
  );
}

export function HeroArrivalBrief({ country, networks, coverage, network, titleId }) {
  return (
    <aside className="heroArrivalBrief" aria-labelledby={titleId}>
      <header><h2 id={titleId}>{country} connection brief</h2><span>04 trip checks</span></header>
      <dl>
        <div><dt>Local operators</dt><dd>{networks}</dd><i aria-hidden="true">⌁</i></div>
        <div><dt>Typical coverage</dt><dd>{coverage}</dd><i aria-hidden="true">⌁</i></div>
        <div><dt>Plan speed</dt><dd>{network}</dd><i aria-hidden="true">⌁</i></div>
        <div><dt>Setup</dt><dd>Install over Wi-Fi before departure; activate after arrival.</dd><i aria-hidden="true">⌁</i></div>
      </dl>
      <a href="#country-essentials">Read the full connection guide <span aria-hidden="true">→</span></a>
    </aside>
  );
}
