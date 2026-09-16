import { regionalChecks } from "./regionalChecks";
import { SiteHeader, SiteFooter, CountryBreadcrumbs } from "./SiteChrome";
import { destinationIdentity } from "./destinationIdentity";
import { destinationRegistry, continentSlug } from "./countryRegistry";
import { sitePath, siteUrl } from "./sitePath";



export default function CountryPlanningGuide({ destination }) {
  const { name, slug, region, flag, code, phone } = destination;
  const identity = destinationIdentity(slug, region);
  const [regionalTitle, regionalAdvice] = regionalChecks[region];
  const related = destinationRegistry.filter((item) => item.region === region && item.slug !== slug).slice(0, 6);
  const data = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${siteUrl(`/${slug}/`)}#webpage`, url: siteUrl(`/${slug}/`), name: `${name} eSIM travel guide`, description: `Coverage, compatibility and setup checks for mobile data in ${name}.`, dateModified: destination.updated, inLanguage: "en", isPartOf: { "@id": `${siteUrl("/")}#website` }, breadcrumb: { "@id": `${siteUrl(`/${slug}/`)}#breadcrumb` } },
    { "@type": "BreadcrumbList", "@id": `${siteUrl(`/${slug}/`)}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "Global eSIMs", item: siteUrl("/") },
      { "@type": "ListItem", position: 2, name: region, item: siteUrl(`/#map-${continentSlug(region)}`) },
      { "@type": "ListItem", position: 3, name, item: siteUrl(`/${slug}/`) },
    ] },
  ] };
  return <div className={`pageShell countryPage ${identity.className}`} id="top" style={identity.style} {...identity.attributes}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
    <SiteHeader /><main id="main-content"><article className="planningGuide">
      <CountryBreadcrumbs region={region} country={name} />
      <header className="planningHero"><p className="routeKicker">{region.toUpperCase()} / CONNECTIVITY PLANNING</p>
        <span className="planningFlag" role="img" aria-label={`Flag of ${name}`}>{flag}</span>
        <h1>{name} eSIM travel guide</h1>
        <p>Prepare your mobile-data setup for {name}: confirm a supported plan, check your phone, and decide how you will connect on arrival.</p>
        <dl><div><dt>Destination code</dt><dd>{code}</dd></div><div><dt>Calling prefix</dt><dd>{phone.map((number) => `+${number}`).join(" / ")}</dd></div><div><dt>Region</dt><dd>{region}</dd></div></dl>
      </header>
      <aside className="availabilityNotice"><strong>Provider availability needs confirmation</strong><p>We have not yet verified a current eSIM offer or price for {name}. This guide does not guarantee service. Confirm that the provider explicitly lists {name}, supports your device and permits use at your destination before purchasing.</p></aside>
      <div className="planningGrid">
        <section><h2>What to check before buying</h2><ol>
          <li><strong>Destination:</strong> look for {name} in the exact plan’s coverage list. A broad {region} label is not enough.</li>
          <li><strong>Network:</strong> ask for the local partner operator and coverage at your arrival point and overnight stops.</li>
          <li><strong>Allowance:</strong> match data and validity to your trip. Check hotspot rules, speed limits and top-ups.</li>
          <li><strong>Total cost:</strong> compare checkout currency, taxes, refund terms and any activation deadline.</li>
        </ol></section>
        <section><h2>{regionalTitle}</h2><p>{regionalAdvice}</p><p>If {name} is one stop in a longer trip, compare individual-country plans with a regional bundle using the same data allowance and travel dates.</p></section>
        <section><h2>Installation and arrival</h2><p>Check that your exact phone model supports eSIM and is unlocked. Read the activation rule before installing: validity may start at purchase, installation or first network connection.</p><p>Where the provider allows advance installation, use reliable Wi-Fi and save the setup instructions offline. On arrival, select the travel line for mobile data and follow the provider’s roaming and APN instructions.</p></section>
        <section><h2>Calls, messages and a backup</h2><p>Do not assume that a data package includes a local phone number, ordinary calls or SMS. {phone.map((number) => `+${number}`).join(" / ")} is a destination dialing prefix, not evidence that an eSIM provides a number.</p><p>Keep accommodation details and maps offline. If no suitable travel eSIM is available, ask your home carrier about roaming and your accommodation about Wi-Fi or local connectivity options before departure.</p></section>
      </div>
      <section className="planningSources" aria-labelledby="provider-check-title"><h2 id="provider-check-title">Check current provider catalogues</h2><p>Search for {name} and read the exact product terms. These catalogue links are research starting points; they are not confirmed offers for this destination.</p><nav aria-label="Provider catalogues"><a href="https://saily.com/">Saily</a><a href="https://www.airalo.com/">Airalo</a><a href="https://esim.holafly.com/">Holafly</a><a href="https://www.getnomad.app/">Nomad</a></nav></section>
      <section className="planningQuestions"><h2>Before you connect in {name}</h2>
        <details><summary>Is a travel eSIM currently available for {name}?</summary><p>Availability has not been verified for this guide. Ask the provider to confirm the destination and local partner network for the specific plan you want; do not buy solely on the basis of a regional name.</p></details>
        <details><summary>What should I do if the eSIM will not connect?</summary><p>Check your selected data line, remaining allowance, validity, APN and roaming settings against the provider’s instructions. Contact support over Wi-Fi and keep the error message. Avoid deleting the eSIM unless support confirms it can be reinstalled.</p></details>
        <details><summary>Can the same plan cover another country in {region}?</summary><p>Only if that country is explicitly included in the plan’s coverage. Check every stop before purchase and confirm whether one validity period and data allowance apply across all destinations.</p></details>
      </section>
      <section className="planningSources"><h2>Continue planning in {region}</h2><nav aria-label="Related destination guides">{related.map((item) => <a href={sitePath(`/${item.slug}/`)} key={item.code}>{item.name}</a>)}<a href={sitePath(`/#map-${continentSlug(region)}`)}>All {region} destinations</a></nav></section>
      <p className="planningSourceNote">Guide added <time dateTime={destination.updated}>September 17, 2026</time>. Destination names and dialing prefixes: <a href="https://github.com/annexare/Countries">Countries dataset</a>. Geographic grouping: <a href="https://unstats.un.org/unsd/methodology/m49/">UN M49</a>. Setup guidance is a checklist; your provider’s instructions take precedence.</p>
    </article></main><SiteFooter region={region} country={name} />
  </div>;
}
