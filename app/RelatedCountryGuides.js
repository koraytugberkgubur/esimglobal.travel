import PriceQuote from "./PriceQuote";
import { hasCurrentPrice } from "./pricePolicy";
import Link from "next/link";
import { countryPages } from "./countryPages";
import { HeadingSignal } from "./EditorialHeading";
import { francePlans } from "./france/plans";

const franceGuide = {
  slug: "france",
  name: "France",
  flag: "🇫🇷",
  code: "FR",
  region: "Europe",
  city: "Paris",
  networks: "Orange, SFR, Bouygues Telecom and Free Mobile",
  plans: francePlans,
};

const countryGuides = [
  franceGuide,
  ...Object.entries(countryPages).map(([slug, destination]) => ({ slug, ...destination })),
];

function operatorNames(text) {
  return (text || "Confirm the provider’s local partner network")
    .replace(/ operate.*$/i, "")
    .replace(/ provide.*$/i, "")
    .replace(/ and (?=[^,]+$)/, " · ")
    .replaceAll(", ", " · ");
}

export default function RelatedCountryGuides({ currentCountry, currentRegion }) {
  const relatedGuides = countryGuides
    .filter((guide) => guide.name !== currentCountry && guide.region === currentRegion)
    .slice(0, 6);
  const headingId = `${currentCountry.toLowerCase().replaceAll(" ", "-")}-related-guides-title`;

  return (
    <section className="onwardDeck" id="related-destinations" aria-labelledby={headingId}>
      <header>
        <div><p className="routeKicker">MORE IN {currentRegion.toUpperCase()}</p><h2 id={headingId}><HeadingSignal />Continue your route in {currentRegion}</h2><p className="onwardIntro">Explore country guides and check provider availability for your onward journey.</p></div>
        <span className="headingMetric">{relatedGuides.length} relevant guides</span>
      </header>
      <nav aria-label={`Other country eSIM guides from ${currentCountry}`}>
        <ul>
          {relatedGuides.map((guide) => {
            const startingPlan = guide.plans.filter(plan => hasCurrentPrice(plan) && plan.currency === "USD").sort((a,b) => a.price-b.price)[0];
            return (
              <li key={guide.slug}>
                <Link href={`/${guide.slug}/`} aria-label={`Compare eSIM plans for ${guide.name}`}>
                  <span className="routeCardFlag" role="img" aria-label={`Flag of ${guide.name}`}>{guide.flag}</span>
                  <span className="routeCardCode">{guide.code}</span>
                  <span className="routeCardRegion">{guide.region}</span>
                  <strong>{guide.name}</strong>
                  <small>{guide.city || guide.name} connection guide</small>
                  <span className="routeCardNetworks">{operatorNames(guide.networks)}</span>
                  <span className="routeCardPrice"><small>{Boolean(startingPlan) ? "Plans from" : "Availability"}</small><b>{Boolean(startingPlan) ? <PriceQuote plan={startingPlan}/> : "Check provider"}</b></span>
                  <span className="routeCardAction">Compare {guide.name} <i aria-hidden="true">⌁</i></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
