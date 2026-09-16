import WorldMap from "./WorldMap";
import EsimGuide from "./EsimGuide";
import { HeadingReadMore, HeadingSignal } from "./EditorialHeading";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { siteUrl } from "./sitePath";

const organizationId = `${siteUrl("/")}#organization`;
const websiteId = `${siteUrl("/")}#website`;
const webpageId = `${siteUrl("/")}#webpage`;
const logoId = `${siteUrl("/images/esim-global-logo.svg")}#logo`;

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "eSIM Global Travel",
      alternateName: ["eSIM Global", "esimglobal.travel"],
      url: siteUrl("/"),
      description:
        "An independent travel eSIM comparison resource covering providers, data allowances, validity, network access and prices for destinations worldwide.",
      logo: { "@id": logoId },
      image: { "@id": logoId },
      location: {
        "@type": "Place",
        name: "Istanbul, Türkiye",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Istanbul",
          addressCountry: "TR",
        },
      },
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      knowsLanguage: "en",
      knowsAbout: [
        "Travel eSIMs",
        "International mobile data",
        "Prepaid eSIM plans",
        "eSIM provider comparison",
        "Mobile network coverage",
        "International roaming alternatives",
      ],
      subjectOf: {
        "@type": "SoftwareSourceCode",
        name: "eSIM Global Travel website source",
        codeRepository: "https://github.com/KTG1/esimglobal.travel",
        programmingLanguage: "JavaScript",
      },
    },
    {
      "@type": "ImageObject",
      "@id": logoId,
      url: siteUrl("/images/esim-global-logo.svg"),
      contentUrl: siteUrl("/images/esim-global-logo.svg"),
      width: 512,
      height: 512,
      caption: "eSIM Global Travel logo",
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl("/"),
      name: "eSIM Global Travel",
      alternateName: "eSIM Global",
      description:
        "Independent comparisons of prepaid travel eSIM providers, plans, coverage and prices.",
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "WebPage",
      "@id": webpageId,
      url: siteUrl("/"),
      name: "Compare Global eSIM Plans for International Travel",
      description:
        "Compare prepaid travel eSIM plans, providers, data, validity and prices for destinations worldwide.",
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
      mainEntity: { "@id": organizationId },
    },
  ],
};

export default function Home() {
  return (
    <div className="pageShell" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />
      <main id="main-content">
      <div className="hero">
        <p className="routeKicker">DESTINATION-INDEXED MOBILE DATA</p>
        <h1><HeadingSignal />Travel data plans, laid out by destination.</h1>
        <HeadingReadMore className="heroLead" href="#compare" label="Open destination index">
          See the published allowance, validity and starting price before choosing a travel eSIM. Each country guide keeps the source close to the claim.
        </HeadingReadMore>
        <WorldMap />
        <EsimGuide />
        <section className="availability" id="how-it-works" aria-labelledby="how-it-works-title">
          <header className="availabilityHeading">
            <p className="availabilityKicker">Your eSIM departure brief</p>
            <h2 id="how-it-works-title">Choose the place. Check the terms. Install once.</h2>
            <p>Compare established providers, choose the right allowance for your trip, and arrive ready to connect—without roaming surprises.</p>
          </header>
          <ol>
            <li>
              <div className="availabilityIcon" aria-hidden="true">
                <svg viewBox="0 0 32 32"><path d="M7 4h13l5 5v19H7zM11 10h6v5h5v7h-6v6M11 19h5"/></svg>
              </div>
              <span className="availabilityStep">01 / Destination</span>
              <h3>Choose where you’re landing</h3>
              <p>Search the map by continent or country and see plans built for your route.</p>
            </li>
            <li>
              <div className="availabilityIcon" aria-hidden="true">
                <svg viewBox="0 0 32 32"><path d="M7 9h18M7 16h18M7 23h18"/><circle cx="12" cy="9" r="2.5"/><circle cx="21" cy="16" r="2.5"/><circle cx="15" cy="23" r="2.5"/></svg>
              </div>
              <span className="availabilityStep">02 / Compare</span>
              <h3>Compare plans side by side</h3>
              <p>Weigh price, data, validity, networks and included features in one view.</p>
            </li>
            <li>
              <div className="availabilityIcon" aria-hidden="true">
                <svg viewBox="0 0 32 32"><rect x="9" y="4.5" width="14" height="23" rx="2.5"/><path d="M13 9.5h6M13 14h6M12 20l2.5 2.5L20 17"/></svg>
              </div>
              <span className="availabilityStep">03 / Connect</span>
              <h3>Install before you fly</h3>
              <p>Receive your digital eSIM, install on Wi-Fi, then activate after arrival.</p>
            </li>
          </ol>
          <footer className="availabilityFooter">
            <span>Instant digital delivery</span>
            <a href="#compare">Start with your destination <b aria-hidden="true">⌁</b></a>
          </footer>
        </section>
        <section className="databaseSection" aria-labelledby="database-title">
          <header className="databaseHeading">
            <div>
              <p className="databaseKicker"><span aria-hidden="true">◎</span> Comparison methodology</p>
              <h2 id="database-title">How the destination index is assembled</h2>
            </div>
            <p>One consistent view of destination coverage, allowances, validity, network support and price—so every plan can be judged by the same travel-ready criteria.</p>
          </header>
          <div className="databaseGrid">
            <article>
              <span className="databaseIndex">Coverage / 01</span>
              <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="10"/><path d="M6.5 16h19M16 6c3.1 3.1 4.6 6.4 4.6 10S19.1 22.9 16 26c-3.1-3.1-4.6-6.4-4.6-10S12.9 9.1 16 6Z"/></svg>
              <h3>Destination-first coverage</h3>
              <p>Country and regional plans are organized around where you are traveling, not around provider marketing.</p>
            </article>
            <article>
              <span className="databaseIndex">Criteria / 02</span>
              <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 8h16M8 16h16M8 24h16"/><circle cx="12" cy="8" r="2.5"/><circle cx="20" cy="16" r="2.5"/><circle cx="15" cy="24" r="2.5"/></svg>
              <h3>Like-for-like plan details</h3>
              <p>Data, trip length, network generation, delivery and activation details appear in a consistent format.</p>
            </article>
            <article>
              <span className="databaseIndex">Method / 03</span>
              <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 5v22M8 10h16M10 10l-4 8h8l-4-8ZM22 10l-4 8h8l-4-8Z"/><path d="M11 27h10"/></svg>
              <h3>Independent comparison</h3>
              <p>Plans are presented with transparent attributes so travelers can assess value without hidden weighting.</p>
            </article>
            <article>
              <span className="databaseIndex">Clarity / 04</span>
              <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 5h14v22H9zM12 10h8M12 15h8M12 20h5"/><path d="m20 22 2 2 4-5"/></svg>
              <h3>Decision-ready summaries</h3>
              <p>Comparison notes explain the practical trade-off between price, allowance, validity and included features.</p>
            </article>
          </div>
          <footer className="databaseFooter">
            <p><strong>Accuracy standard</strong> Provider terms and live checkout prices should always be verified before purchase.</p>
            <a href="#compare">Explore the database <span aria-hidden="true">⌁</span></a>
          </footer>
        </section>
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
