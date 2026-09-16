import { sitePath } from "./sitePath";
import { countryPages } from "./countryPages";
import { getFooterDestinations } from "./footerDestinations";

export function BrandLogo({ inverted = false }) {
  return (
    <span className={`brandLogo ${inverted ? "inverted" : ""}`}>
      <span className="orbitMonogram" aria-hidden="true"><b>e</b><i /></span>
      <span className="logoType"><strong>eSIM</strong><span>GLOBAL</span><small>.TRAVEL</small></span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <>
      <a className="skipLink" href="#main-content">Skip to main content</a>
      <header className="siteHeader">
        <a href={sitePath("/")} aria-label="eSIM Global Travel home"><BrandLogo /></a>
        <nav aria-label="Primary navigation">
          <ul>
            <li><a href={sitePath("/#compare")}>Compare plans</a></li>
            <li><a href={sitePath("/#how-it-works")}>How it works</a></li>
            <li><a href={sitePath("/#about")}>About</a></li>
          </ul>
        </nav>
        <a className="headerCta" href={sitePath("/#compare")}>Find an eSIM <span aria-hidden="true">⌁</span></a>
      </header>
    </>
  );
}

const destinationDirectory = [
  { name: "France", href: "/france/", region: "Europe" },
  ...Object.entries(countryPages).map(([slug, destination]) => ({ name: destination.name, href: `/${slug}/`, region: destination.region })),
];

const continentOrder = ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"];
const continentCodes = { Europe: "EU", Asia: "AS", Africa: "AF", "North America": "NA", "South America": "SA", Oceania: "OC" };

export function CountryBreadcrumbs({ region, country }) {
  const regionalDestinations = destinationDirectory.filter((item) => item.region === region);
  const continentDestinations = continentOrder.map((name) => {
    const landingPage = destinationDirectory.find((item) => item.region === name);
    return { name, href: landingPage.href, code: continentCodes[name], count: destinationDirectory.filter((item) => item.region === name).length };
  });
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbMenu">
        <li><a className="breadcrumbHome" href={sitePath("/")}>Global eSIMs</a></li>
        <li><details><summary>{region}<i aria-hidden="true" /></summary><div className="crumbPopover regionPopover"><small>Switch continent</small>{continentDestinations.map((item) => <a href={sitePath(item.href)} key={item.name} aria-current={item.name === region ? "page" : undefined}><span>{item.name}<em>{item.count} guides</em></span><b aria-hidden="true">{item.code}</b></a>)}</div></details></li>
        <li><details><summary className="currentCrumb" aria-current="location">{country}<i aria-hidden="true" /></summary><div className="crumbPopover countryPopover"><small>Switch destination</small>{regionalDestinations.map((item) => <a href={sitePath(item.href)} key={item.href} aria-current={item.name === country ? "page" : undefined}>{item.name}<b aria-hidden="true">⌁</b></a>)}</div></details></li>
      </ol>
    </nav>
  );
}

export function SiteFooter({ country }) {
  const destinations = getFooterDestinations(country);
  return (
    <footer className="atlasFooter" id="about">
      <div className="footerTopRow">
        <div className="footerLead">
          <a href={sitePath("/")} aria-label="eSIM Global Travel home"><BrandLogo inverted /></a>
          <p>Independent travel eSIM guides.</p>
        </div>
        <nav className="footerGuideNav" aria-labelledby="footer-explore-title">
          <h2 id="footer-explore-title" className="srOnly">Plan your connection</h2>
          <ul>
            <li><a href={sitePath("/#compare")}>Compare on the map</a></li>
            <li><a href={sitePath("/what-is-a-travel-esim/")}>What is a travel eSIM?</a></li>
            <li><a href={sitePath("/how-to-choose-a-travel-esim/")}>How to choose an eSIM</a></li>
            <li><a href={sitePath("/best-travel-esim/")}>Compare travel eSIMs</a></li>
            <li><a href={sitePath("/esim-glossary/")}>eSIM glossary</a></li>
            <li><a href={sitePath("/sitemap.xml")}>Sitemap</a></li>
          </ul>
        </nav>
      </div>
      <nav className="footerCountrySection" aria-labelledby="footer-countries-title">
        <h2 id="footer-countries-title">{country ? `Explore near ${country}` : "Featured destinations"}</h2>
        <ul className="footerCountryLinks">
          {destinations.map((item) => <li key={item.slug}><a href={sitePath(`/${item.slug}/`)}>{item.name}<span aria-hidden="true">↗</span></a></li>)}
        </ul>
      </nav>
      <div className="footerBase"><span>© {new Date().getFullYear()} eSIM Global Travel</span><span>Provider terms apply · Check current prices</span><span>Istanbul · Worldwide</span></div>
    </footer>
  );
}
