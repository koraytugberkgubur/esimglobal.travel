"use client";

import { HeadingReadMore, HeadingSignal } from "./EditorialHeading";

import { useEffect, useMemo, useState } from "react";
import { sitePath } from "./sitePath";
import world from "@svg-maps/world";
import { continents } from "countries-list";
import { destinationRegistry, destinationByCode, continentSlug } from "./countryRegistry";

import { regionalChecks } from "./regionalChecks";

const regionOrder = ["NA", "SA", "EU", "AF", "AS", "OC"];
const regionLabels = continents;
const regionViewBoxes = {
  NA: "0 20 480 390",
  SA: "170 245 330 415",
  EU: "380 170 270 240",
  AF: "360 245 350 410",
  AS: "480 65 530 430",
  OC: "690 300 320 330",
};
const brandOffers = {
  NA: [{ brand: "Saily", product: "North America", data: "5 GB", days: 30, price: 16.99, color: "#3626a7" }, { brand: "Airalo", product: "North America Regional", data: "3 GB", days: 30, price: 12, color: "#ff6b4a" }, { brand: "Holafly", product: "North America Unlimited", data: "Unlimited", days: 7, price: 29, color: "#7b2dff" }],
  SA: [{ brand: "Saily", product: "Latin America", data: "3 GB", days: 30, price: 15.99, color: "#3626a7" }, { brand: "Airalo", product: "Latamlink", data: "5 GB", days: 30, price: 27, color: "#ff6b4a" }, { brand: "Holafly", product: "Latin America Unlimited", data: "Unlimited", days: 7, price: 34, color: "#7b2dff" }],
  EU: [{ brand: "Airalo", product: "Eurolink", data: "3 GB", days: 30, price: 11, color: "#ff6b4a", verified: true }, { brand: "Saily", product: "Europe", data: "3 GB", days: 30, price: 12.49, color: "#3626a7", verified: true }, { brand: "Holafly", product: "Europe Unlimited", data: "Unlimited", days: 7, price: 27.5, color: "#7b2dff", verified: true }],
  AF: [{ brand: "Saily", product: "Africa", data: "3 GB", days: 30, price: 19.99, color: "#3626a7" }, { brand: "Airalo", product: "Hello Africa", data: "3 GB", days: 30, price: 14, color: "#ff6b4a" }, { brand: "Holafly", product: "Africa Unlimited", data: "Unlimited", days: 7, price: 39, color: "#7b2dff" }],
  AS: [{ brand: "Saily", product: "Asia & Oceania", data: "3 GB", days: 30, price: 12.49, color: "#3626a7" }, { brand: "Nomad", product: "APAC", data: "5 GB", days: 30, price: 15, color: "#6f5cff" }, { brand: "Airalo", product: "Asialink", data: "10 GB", days: 30, price: 37, color: "#ff6b4a" }],
  OC: [{ brand: "Saily", product: "Oceania", data: "5 GB", days: 30, price: 19.99, color: "#3626a7" }, { brand: "Nomad", product: "Oceania", data: "5 GB", days: 30, price: 16, color: "#6f5cff" }, { brand: "Airalo", product: "Island Hopper", data: "3 GB", days: 30, price: 12, color: "#ff6b4a" }],
};
const brandFacts = {
  Saily: { network: "3G / 4G / 5G", delivery: "Instant QR", activation: "On arrival", extra: "Web protection" },
  Airalo: { network: "3G / 4G / 5G", delivery: "Instant eSIM", activation: "On network", extra: "Top-ups available" },
  Holafly: { network: "4G / 5G", delivery: "Instant QR", activation: "On network", extra: "Unlimited data" },
  Nomad: { network: "4G / 5G", delivery: "Instant eSIM", activation: "On network", extra: "Add-on data" },
};
function rankOffers(region, country) {
  const offers = [...(brandOffers[region] || [])];
  // Regional examples are not verified country offers.
  if (country) return [];
  return offers;
}

const mapCountries = world.locations
  .map((location) => {
    const code = location.id.toUpperCase();
    const details = destinationByCode[code];
    return details ? { ...location, code, ...details } : null;
  })
  .filter((country) => country && country.continent !== "AN");

export default function WorldMap({ guideSummaries = {} }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [hoveredOffer, setHoveredOffer] = useState(null);

  const visibleCountries = useMemo(() => {
    const query = search.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return destinationRegistry
      .filter((country) => query || !selectedRegion || country.continent === selectedRegion)
      .filter((country) => !query || `${country.name} ${country.slug} ${country.code}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(query))
      .sort((a, b) => {
        if (selectedCountry?.code === a.code) return -1;
        if (selectedCountry?.code === b.code) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [search, selectedCountry, selectedRegion]);

  const rankedOffers = useMemo(
    () => selectedRegion ? rankOffers(selectedRegion, selectedCountry) : [],
    [selectedCountry, selectedRegion],
  );

  function setMapHash(hash) {
    if (window.location.hash !== `#${hash}`) window.history.pushState(null, "", `#${hash}`);
  }

  useEffect(() => {
    function restoreMapLocation() {
      const hash = window.location.hash.slice(1);
      const country = destinationRegistry.find((item) => hash === `map-country-${item.slug}`);
      const region = regionOrder.find((key) => [
        `map-${continentSlug(regionLabels[key])}`,
        `destinations-${continentSlug(regionLabels[key])}`,
      ].includes(hash));
      if (!country && !region && !["", "compare", "destinations"].includes(hash)) return;
      setSelectedRegion(country?.continent || region || null);
      setSelectedCountry(country || null);
      setSelectedOffer(!country && region ? brandOffers[region][0] : null);
      setHoveredOffer(null);
      setSearch("");
      if (hash) requestAnimationFrame(() => document.getElementById("compare")?.scrollIntoView({ block: "start" }));
    }
    restoreMapLocation();
    window.addEventListener("hashchange", restoreMapLocation);
    return () => window.removeEventListener("hashchange", restoreMapLocation);
  }, []);

  function chooseRegion(region) {
    setMapHash(region ? `map-${continentSlug(regionLabels[region])}` : "compare");
    setSelectedRegion(region);
    setSelectedCountry(null);
    setSearch("");
    setSelectedOffer(region ? brandOffers[region][0] || null : null);
    setHoveredOffer(null);
  }

  function chooseCountry(country) {
    setMapHash(`map-country-${country.slug}`);
    setSelectedOffer(rankOffers(country.continent, country)[0] || null);
    setSelectedRegion(country.continent);
    setSelectedCountry(country);
    setSearch("");
    setHoveredOffer(null);
    requestAnimationFrame(() => document.getElementById("map-country-guide")?.scrollIntoView({ block: "nearest" }));
  }

  function comparisonCopy(offer) {
    if (!offer) return "Choose an option to compare its value, allowance, and trip length.";
    const destination = selectedCountry?.name || regionLabels[selectedRegion];
    const alternatives = rankedOffers.filter((item) => item.brand !== offer.brand).sort((a, b) => a.price - b.price);
    const cheapest = [...rankedOffers].sort((a, b) => a.price - b.price)[0];
    const nearest = alternatives[0];
    if (offer.brand === "Saily") {
      const difference = cheapest && cheapest.brand !== offer.brand ? offer.price - cheapest.price : 0;
      return `Balanced pick for ${destination}: ${offer.data} for ${offer.days} days with web protection${difference > 0 ? `, for $${difference.toFixed(2)} more than the lowest-priced option` : " at the lowest listed price"}.`;
    }
    if (offer.price === cheapest?.price) {
      const saving = nearest ? nearest.price - offer.price : 0;
      return `Lowest listed price for ${destination}: ${offer.data} for ${offer.days} days${saving > 0 ? `, saving $${saving.toFixed(2)} versus the next option` : ""}.`;
    }
    if (offer.data === "Unlimited") {
      return `Unlimited-data choice for ${destination}: best suited to heavy use, at $${(offer.price - cheapest.price).toFixed(2)} more than the lowest-priced option.`;
    }
    return `${offer.data} for ${offer.days} days in ${destination}, priced at $${offer.price.toFixed(2)}. Compare allowance and included features before choosing.`;
  }

  function handleCountryKey(event, country) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      chooseCountry(country);
    }
  }

  return (
    <section className="destinationFinder" id="compare" aria-labelledby="destination-title">
      <div className="finderTopline">
        <div>
          <p className="finderStep">Destination index</p>
          <h2 id="destination-title"><HeadingSignal />
            {selectedRegion ? regionLabels[selectedRegion] : "Where will you use mobile data?"}
          </h2>
          {selectedCountry && <h3 className="selectedCountryHeading">{selectedCountry.name}</h3>}
          <HeadingReadMore href="#map-workspace" label="Open the index">Select a country on the map or search by name to read its connection guide.</HeadingReadMore>
        </div>
        <p className="coverageCount">
          <strong>{destinationRegistry.length}</strong>
          <span>destination guides</span>
        </p>
      </div>

      <div className="continentTabs" role="group" aria-label="Filter the map by continent">
        <button
          type="button"
          className={!selectedRegion ? "active" : ""}
          onClick={() => chooseRegion(null)}
          aria-pressed={!selectedRegion}
        >
          World
        </button>
        {regionOrder.map((region) => (
          <button
            key={region}
            type="button"
            className={selectedRegion === region ? "active" : ""}
            onClick={() => chooseRegion(region)}
            aria-pressed={selectedRegion === region}
          >
            {regionLabels[region]}
          </button>
        ))}
      </div>

      <div className={`mapWorkspace isExploring integratedMap ${selectedCountry ? "hasCountry" : ""} ${!selectedRegion ? "isWorld" : ""}`} id="map-workspace">
        <div className="mapCanvas">
          {selectedRegion && !selectedCountry && (
            <section className="mapPlanOverlay" aria-labelledby="regional-options-title">
              <h3 className="srOnly" id="regional-options-title">Best eSIM options for {regionLabels[selectedRegion]}</h3>
              <p>Best regional eSIMs <span>Preview pricing</span></p>
              <ul>
                {rankedOffers.map((offer, index) => (
                  <li key={offer.brand}><button
                    type="button"
                    className={selectedOffer?.brand === offer.brand ? "selected" : ""}
                    style={{ "--brand-color": offer.color }}
                    onClick={() => setSelectedOffer(offer)}
                    onMouseEnter={() => setHoveredOffer(offer)}
                    onMouseLeave={() => setHoveredOffer(null)}
                    onFocus={() => setHoveredOffer(offer)}
                    onBlur={() => setHoveredOffer(null)}
                    aria-pressed={selectedOffer?.brand === offer.brand}
                  >
                    <span className="brandName"><i />{offer.brand}{selectedCountry && <em>{index === 0 ? "Best match" : `#${index + 1}`}</em>}</span>
                    <strong>${offer.price.toFixed(2)}</strong>
                    <small>{offer.product} · {offer.data} · {offer.days}d</small>
                  </button></li>
                ))}
                {!rankedOffers.length && <li className="noOffers">No consumer regional plans found.</li>}
              </ul>
              {!!rankedOffers.length && (
                <div className="offerNarration" role="status" aria-live="polite">
                  <span>Comparison note</span>
                  <p>{comparisonCopy(hoveredOffer || selectedOffer)}</p>
                </div>
              )}
            </section>
          )}
          <svg
            className="countryMap"
            viewBox={selectedRegion ? regionViewBoxes[selectedRegion] : world.viewBox}
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-label="Interactive world map. Select a country or choose a continent above."
          >
            <g>
              {mapCountries.map((country) => {
                const isSelected = selectedCountry?.code === country.code;
                const isInRegion = selectedRegion === country.continent;
                const isMuted = selectedRegion && !isInRegion;
                return (
                  <path
                    key={country.id}
                    d={country.path}
                    className={`mapCountry${isInRegion ? " inRegion" : ""}${isSelected ? " selected" : ""}${isMuted ? " muted" : ""}`}
                    role="button"
                    tabIndex={selectedRegion && !isInRegion ? -1 : 0}
                    aria-label={`${country.name}, ${regionLabels[country.continent]}`}
                    aria-pressed={isSelected}
                    onClick={() => chooseCountry(country)}
                    onKeyDown={(event) => handleCountryKey(event, country)}
                  >
                    <title>{country.name}</title>
                  </path>
                );
              })}
            </g>
          </svg>
          {selectedCountry && <MapCountryGuide key={selectedCountry.code} country={selectedCountry} guide={guideSummaries[selectedCountry.slug]} />}
          {selectedOffer && (
            <article
              className="mapPlanPassport"
              style={{ "--brand-color": selectedOffer.color }}
              aria-label={`${selectedOffer.brand} ${selectedOffer.product} plan details`}
            >
              <header>
                <div>
                  <span><i /> Selected eSIM</span>
                  <h3>{selectedOffer.brand} <small>{selectedOffer.product}</small></h3>
                </div>
                <strong>${selectedOffer.price.toFixed(2)}</strong>
              </header>
              <dl>
                <div><dt>Allowance</dt><dd>{selectedOffer.data}</dd></div>
                <div><dt>Validity</dt><dd>{selectedOffer.days} days</dd></div>
                <div><dt>Network</dt><dd>{brandFacts[selectedOffer.brand].network}</dd></div>
                <div><dt>Delivery</dt><dd>{brandFacts[selectedOffer.brand].delivery}</dd></div>
                <div><dt>Activation</dt><dd>{brandFacts[selectedOffer.brand].activation}</dd></div>
                <div><dt>Included</dt><dd>{brandFacts[selectedOffer.brand].extra}</dd></div>
              </dl>
              <footer>
                <span>{destinationRegistry.filter((country) => country.continent === selectedRegion).length} destination guides</span>
                <span>Provider terms apply</span>
              </footer>
            </article>
          )}
          <div className="mapLegend" aria-hidden="true">
            <span><i className="legendAvailable" /> Selectable</span>
            <span><i className="legendSelected" /> Selected</span>
          </div>
          {!selectedRegion && (
            <p className="mapInstruction">Click a country to read its guide.</p>
          )}
        </div>

        <aside className="countryManifest mapBrowser" aria-label="Browse destination guides">
          <div className="manifestHeader">
            <div><p className="finderStep">Explore the map</p><h3>{search ? "Search results" : selectedRegion ? regionLabels[selectedRegion] : "All destinations"}</h3></div>
            <span aria-live="polite">{visibleCountries.length}</span>
          </div>
          <label className="countrySearch">
            <span className="srOnly">Search destinations</span>
            <input type="search" placeholder="Country name or code" value={search} onChange={(event) => setSearch(event.target.value)} />
            <span aria-hidden="true">⌕</span>
          </label>
          <p className="mapBrowserHint">Select a country for its guide. Search covers all {destinationRegistry.length} destinations.</p>
          <div className="countryList" role="group" aria-label="Destination results">
            {visibleCountries.map((country) => <div key={country.code} className={`mapDestinationRow ${selectedCountry?.code === country.code ? "selected" : ""}`}>
              <button type="button" onClick={() => chooseCountry(country)} aria-pressed={selectedCountry?.code === country.code} aria-controls="map-country-guide" aria-label={`Preview ${country.name} guide`}>
                <span className="countryCode">{country.code}</span><span>{country.name}</span><span className="countryArrow" aria-hidden="true">{selectedCountry?.code === country.code ? "✓" : "→"}</span>
              </button>
              <a href={sitePath(`/${country.slug}/`)} aria-label={`Read full ${country.name} guide`} title={`Read full ${country.name} guide`}>↗</a>
            </div>)}
            {!visibleCountries.length && <p className="noCountries">No matching destination. Try a country name or two-letter code.</p>}
          </div>
          <p className="mapBrowserFootnote">Small countries and islands are searchable even when they are too small to select on the map.</p>
        </aside>
      </div>
    </section>
  );
}


function MapCountryGuide({ country, guide }) {
  const [regionalTitle, regionalAdvice] = regionalChecks[country.region];
  return <article className="mapCountryGuide" id="map-country-guide" aria-labelledby="map-guide-title">
    <header><div><span className="mapGuideRegion">{country.region} · {country.code}</span><h3 id="map-guide-title"><span aria-hidden="true">{country.flag}</span> {country.name}</h3></div><a className="mapGuideLink" href={sitePath(`/${country.slug}/`)}>Read full guide ↗</a></header>
    <p>{guide?.summary || `Prepare your mobile-data setup for ${country.name}: confirm a supported plan, check your phone, and decide how you will connect on arrival.`}</p>
    {guide?.offer ? <div className="mapGuideOffer"><strong>{guide.offer.brand} · {guide.offer.dataLabel} · {guide.offer.daysLabel}</strong><span>${guide.offer.price.toFixed(2)}</span><small>Published offer checked {guide.sourceChecked}. Verify current terms before buying.</small></div> : <p className="mapGuideAvailability">Current offers for {country.name} have not yet been verified. Confirm destination availability with the provider.</p>}
    <details><summary>Networks and coverage</summary><p>{guide?.networks || `Ask the provider which local network its ${country.name} plan uses, then check coverage at your arrival point and overnight stops.`}</p>{guide?.coverage && <p>{guide.coverage}</p>}</details>
    <details><summary>Installation and arrival</summary><p>Check that your exact phone model supports eSIM and is unlocked. Read the activation rule before installing: validity may start at purchase, installation or first network connection. Save the setup instructions offline and follow the provider’s data-line, roaming and APN guidance on arrival.</p></details>
    <details><summary>{regionalTitle}</summary><p>{regionalAdvice}</p></details>
    <footer><span>Calling prefix {country.phone.map((number) => `+${number}`).join(" / ")}</span><a href={sitePath(`/${country.slug}/`)}>All {country.name} advice and FAQs</a></footer>
  </article>;
}
