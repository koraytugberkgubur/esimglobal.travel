import CountryPlanningGuide from "../CountryPlanningGuide";
import { notFound } from "next/navigation";
import { countryPages, countrySlugs } from "../countryPages";
import { HeroArrivalBrief, HeroQuickAnswer } from "../CountryHeroContent";
import CountryFaqTabs from "../CountryFaqTabs";
import { HeadingReadMore, HeadingSignal } from "../EditorialHeading";
import RelatedCountryGuides from "../RelatedCountryGuides";
import FrancePlans, { HeroPlanStrip } from "../france/FrancePlans";
import { CountryBreadcrumbs, SiteFooter, SiteHeader } from "../SiteChrome";
import { sitePath, siteUrl } from "../sitePath";
import CountryStructuredData from "../CountryStructuredData";
import { destinationIdentity } from "../destinationIdentity";

export function generateStaticParams() {
  return countrySlugs.map((country) => ({ country }));
}

export async function generateMetadata({ params }) {
  const { country } = await params;
  const destination = countryPages[country];
  if (!destination) return {};
  if (destination.availability === "unverified") {
    const title = `${destination.name} eSIM Guide: Coverage & Setup Checks | eSIM Global`;
    const description = `Plan mobile connectivity in ${destination.name}. Check destination coverage, device compatibility, activation, calls and provider availability before buying an eSIM.`;
    return { title, description, alternates: { canonical: siteUrl(`/${country}/`) },
      openGraph: { title, description, url: siteUrl(`/${country}/`), type: "website" },
      twitter: { card: "summary", title, description } };
  }
  return {
    title: `Best eSIM for ${destination.name}: Compare Plans & Prices | eSIM Global`,
    description: `Compare travel eSIM plans for ${destination.name} by provider, data, validity, network and price. Find the right prepaid eSIM for your trip.`,
    alternates: { canonical: siteUrl(`/${country}/`) },
    openGraph: {
      title: `Best eSIM for ${destination.name}: Compare Plans & Prices`,
      description: `Compare prepaid ${destination.name} eSIM plans, coverage, data, validity and prices before you travel.`,
      url: siteUrl(`/${country}/`),
      siteName: "eSIM Global Travel",
      type: "website",
      images: [{ url: siteUrl(destination.heroImage), width: destination.heroWidth, height: destination.heroHeight, alt: destination.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Best eSIM for ${destination.name}`,
      description: `Compare prepaid ${destination.name} eSIM plans, coverage, data and prices.`,
      images: [siteUrl(destination.heroImage)],
    },
  };
}

export default async function CountryPage({ params }) {
  const { country } = await params;
  const destination = countryPages[country];
  if (!destination) notFound();
  if (destination.availability === "unverified") return <CountryPlanningGuide destination={destination} />;
  const faqId = `${country}-faq-title`;
  const heroTitleId = `${country}-hero-title`;
  const essentialsTitleId = `${country}-essentials-title`;
  const identity = destinationIdentity(country, destination.region);

  return (
    <div className={`pageShell countryPage ${identity.className}`} id="top" style={identity.style} {...identity.attributes}>
      <CountryStructuredData
        slug={country}
        name={destination.name}
        description={`Compare travel eSIM plans for ${destination.name} by provider, data, validity, network and price. Find the right prepaid eSIM for your trip.`}
        image={destination.heroImage}
        imageAlt={destination.heroAlt}
        plans={destination.plans}
        networks={destination.networks}
        coverage={destination.coverage}
      />
      <SiteHeader />
      <main id="main-content"><article className={`destinationStory destinationStory--${country}`}>
      <CountryBreadcrumbs region={destination.region} country={destination.name} />
      <section
        className="franceHero countryHero countryDestinationHero"
        aria-labelledby={heroTitleId}
        style={{
          backgroundImage: `url("${sitePath(destination.heroImage)}")`,
          "--hero-position": destination.heroPosition,
        }}
      >
        <div className="franceHeroCopy">
          <span className="countryEmojiFlag" role="img" aria-label={`Flag of ${destination.name}`}>{destination.flag}</span>
          <p className="routeKicker">{destination.name.toUpperCase()} ESIM COMPARISON / UPDATED <time dateTime="2026-08-12">AUGUST 2026</time></p>
          <h1 id={heroTitleId}><HeadingSignal />Find the best eSIM for {destination.name}.</h1>
          <HeroQuickAnswer country={destination.name} plan={destination.plans[0]} summary={destination.heroSummary} reason={destination.pickReason} />
        </div>
        <figure className="franceVisual genericCountryVisual" data-code={destination.code}>
          <figcaption className="srOnly">{destination.heroAlt}</figcaption>
          <div className="parisStamp" aria-label={`${destination.city}, ${destination.name}`}><span>{destination.city.slice(0, 3).toUpperCase()}</span><strong>{destination.code}</strong><small>{destination.region}</small></div>
          <div className="countrySignal" aria-hidden="true"><i /><i /><i /><i /></div>
          <HeroArrivalBrief country={destination.name} networks={destination.networks} coverage={destination.coverage} network={destination.plans[0].network} titleId={`${country}-arrival-title`} />
          <span className="routeLabel">{destination.airport} → Connected</span>
        </figure>
        <HeroPlanStrip country={destination.name} plans={destination.plans} />
      </section>

      <FrancePlans country={destination.name} plans={destination.plans} sourceUrl={destination.sourceUrl} sourceChecked={destination.sourceChecked} />

      <section className="franceEssentials" id="country-essentials" aria-labelledby={essentialsTitleId}>
        <div><p className="routeKicker">BEFORE YOU CONNECT</p><h2 id={essentialsTitleId}><HeadingSignal />Using a travel eSIM in {destination.name}</h2><HeadingReadMore href="#country-faq" label="Read the FAQs">Review local operators, expected coverage and the safest time to install and activate your travel eSIM.</HeadingReadMore></div>
        <dl><div><dt>Networks</dt><dd>{destination.networks}</dd></div><div><dt>Coverage</dt><dd>{destination.coverage}</dd></div><div><dt>Installation</dt><dd>Install on Wi-Fi before departure, then activate the data line after arrival.</dd></div></dl>
      </section>

      <section className="franceFaq" id="country-faq" aria-labelledby={faqId}>
        <header><div><p className="routeKicker">{destination.name.toUpperCase()} ESIM FAQ</p><h2 id={faqId}><HeadingSignal />Questions before you connect</h2><HeadingReadMore href="#related-destinations" label="More destinations">Check plan choice, setup, calls, hotspot use and regional coverage before purchasing.</HeadingReadMore></div><span>18 practical answers</span></header>
        <CountryFaqTabs country={destination.name} bestPlan={destination.plans[0]} networks={destination.networks} coverage={destination.coverage} plans={destination.plans} />
      </section>
      <RelatedCountryGuides currentCountry={destination.name} currentRegion={destination.region} />
      </article></main>
      <SiteFooter region={destination.region} country={destination.name} />
    </div>
  );
}
