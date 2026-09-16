import { primaryPlan } from "../pricePolicy";
import FrancePlans, { HeroPlanStrip } from "./FrancePlans";
import { francePlans } from "./plans";
import { HeroArrivalBrief, HeroQuickAnswer } from "../CountryHeroContent";
import CountryFaqTabs from "../CountryFaqTabs";
import { HeadingReadMore, HeadingSignal } from "../EditorialHeading";
import RelatedCountryGuides from "../RelatedCountryGuides";
import { CountryBreadcrumbs, SiteFooter, SiteHeader } from "../SiteChrome";
import { sitePath, siteUrl } from "../sitePath";
import CountryStructuredData from "../CountryStructuredData";
import { destinationIdentity } from "../destinationIdentity";

export const metadata = {
  title: "Best eSIM for France: Compare Data Plans & Prices | eSIM Global",
  description: "Compare travel eSIM plans for France by provider, data, validity, network and price. Find prepaid France eSIM options for your trip.",
  alternates: { canonical: siteUrl("/france/") },
  openGraph: {
    title: "Best eSIM for France: Compare Data Plans & Prices",
    description: "Compare prepaid France eSIM plans, coverage, data, validity and prices before you travel.",
    url: siteUrl("/france/"),
    siteName: "eSIM Global Travel",
    type: "website",
    images: [{ url: siteUrl("/images/france-esim-hero.jpg"), width: 1200, height: 630, alt: "The Eiffel Tower illuminated at blue hour in Paris, France" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best eSIM for France",
    description: "Compare prepaid France eSIM plans, coverage, data and prices.",
    images: [siteUrl("/images/france-esim-hero.jpg")],
  },
};

export default function FrancePage() {
  const identity = destinationIdentity("france", "Europe");
  return (
    <div className={`pageShell countryPage ${identity.className}`} id="top" style={identity.style} {...identity.attributes}>
      <CountryStructuredData
        slug="france"
        name="France"
        description="Compare travel eSIM plans for France by provider, data, validity, network and price. Find prepaid France eSIM options for your trip."
        image="/images/france-esim-hero.jpg"
        imageAlt="The Eiffel Tower illuminated at blue hour in Paris, France"
        plans={francePlans}
        networks="Orange, SFR, Bouygues Telecom and Free Mobile operate nationwide networks."
        coverage="4G is widely available; 5G depends on location and the selected plan."
      />
      <SiteHeader />
      <main id="main-content"><article className="destinationStory destinationStory--france">
      <CountryBreadcrumbs region="Europe" country="France" />

      <section className="franceHero franceDestinationHero" aria-labelledby="france-hero-title" style={{ backgroundImage: `url("${sitePath("/images/france-esim-hero.jpg")}")`, "--hero-position": "center 52%" }}>
        <div className="franceHeroCopy">
          <span className="franceFlag" role="img" aria-label="Flag of France"><i /><i /><i /></span>
          <p className="routeKicker">FRANCE ESIM COMPARISON / PACKAGE PRICES CHECKED INDIVIDUALLY</p>
          <h1 id="france-hero-title"><HeadingSignal />Find the best eSIM for France.</h1>
          <HeroQuickAnswer country="France" plan={primaryPlan(francePlans)} summary="Compare prepaid France eSIM plans for Paris, Lyon, Nice and travel between regions. Review data, validity, 4G and 5G access, hotspot rules and total price before choosing." />
        </div>
        <figure className="franceVisual">
          <figcaption className="srOnly">The Eiffel Tower illuminated at blue hour in Paris, France</figcaption>
          <div className="parisStamp" aria-label="Paris: 48.8566 degrees north, 2.3522 degrees east"><span>PAR</span><strong>48.8566° N</strong><small>02.3522° E</small></div>
          <div className="eiffelMark" aria-hidden="true"><i /><i /><i /><i /></div>
          <HeroArrivalBrief country="France" networks="Orange, SFR, Bouygues Telecom and Free Mobile operate nationwide networks." coverage="4G is widely available; 5G depends on location and the selected plan." network="4G / 5G" titleId="france-arrival-title" />
          <span className="routeLabel">CDG → Connected</span>
        </figure>
        <HeroPlanStrip country="France" plans={francePlans} />
      </section>

      <FrancePlans />

      <section className="franceEssentials" id="country-essentials" aria-labelledby="france-essentials-title">
        <div><p className="routeKicker">BEFORE YOU CONNECT</p><h2 id="france-essentials-title"><HeadingSignal />Using a travel eSIM in France</h2><HeadingReadMore href="#country-faq" label="Read the FAQs">Review French mobile operators, expected coverage and the safest time to install and activate your travel eSIM.</HeadingReadMore></div>
        <dl><div><dt>Networks</dt><dd>Orange, SFR, Bouygues Telecom and Free Mobile operate nationwide networks.</dd></div><div><dt>Coverage</dt><dd>4G is widely available; 5G availability depends on location and the selected plan.</dd></div><div><dt>Installation</dt><dd>Install on Wi-Fi before departure, then activate the data line after arrival.</dd></div></dl>
      </section>

      <section className="franceFaq" id="country-faq" aria-labelledby="france-faq-title">
        <header>
          <div><p className="routeKicker">FRANCE ESIM FAQ</p><h2 id="france-faq-title"><HeadingSignal />Questions before you connect</h2><HeadingReadMore href="#related-destinations" label="More destinations">Check plan choice, setup, calls, hotspot use and regional coverage before purchasing.</HeadingReadMore></div>
          <span>18 practical answers</span>
        </header>
        <CountryFaqTabs country="France" bestPlan={primaryPlan(francePlans)} networks="Orange, SFR, Bouygues Telecom and Free Mobile operate nationwide networks." coverage="4G is widely available; 5G depends on location and the selected plan." plans={francePlans} />
      </section>
      <RelatedCountryGuides currentCountry="France" currentRegion="Europe" />
      </article></main>
      <SiteFooter region="Europe" country="France" />
    </div>
  );
}
