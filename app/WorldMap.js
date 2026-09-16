"use client";

import { HeadingReadMore, HeadingSignal } from "./EditorialHeading";

import { useMemo, useState } from "react";
import { sitePath } from "./sitePath";
import { destinationByCode } from "./countryRegistry";
import { buildProviderPlanCatalog } from "./providerPlanCatalog";
import { providerHighlights, samePackage, validityText } from "./pricePolicy";
import { usePricePresentation } from "./PriceQuote";
import world from "@svg-maps/world";
import { continents, countries } from "countries-list";

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
const brandFacts = {
  Saily: { network: "3G / 4G / 5G", delivery: "Instant QR", activation: "On arrival", extra: "Web protection" },
  Airalo: { network: "3G / 4G / 5G", delivery: "Instant eSIM", activation: "On network", extra: "Top-ups available" },
  Holafly: { network: "4G / 5G", delivery: "Instant QR", activation: "On network", extra: "Unlimited data" },
  Nomad: { network: "4G / 5G", delivery: "Instant eSIM", activation: "On network", extra: "Add-on data" },
};
function rankOffers(region, country) {
  const destination = country && destinationByCode[country.code];
  if (!destination) return [];
  return providerHighlights(buildProviderPlanCatalog(destination.name, destination.slug)).slice(0, 3);
}

const mapCountries = world.locations
  .map((location) => {
    const code = location.id.toUpperCase();
    const details = countries[code];
    return details ? { ...location, code, ...details } : null;
  })
  .filter((country) => country && country.continent !== "AN");

export default function WorldMap() {
  const { priceText, checkedText, hasCurrentPrice } = usePricePresentation();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [hoveredOffer, setHoveredOffer] = useState(null);

  const visibleCountries = useMemo(() => {
    if (!selectedRegion) return [];
    const query = search.trim().toLowerCase();
    return mapCountries
      .filter((country) => country.continent === selectedRegion)
      .filter((country) => !query || country.name.toLowerCase().includes(query))
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

  function chooseRegion(region) {
    setSelectedRegion(region);
    setSelectedCountry(null);
    setSearch("");
    setSelectedOffer(null);
    setHoveredOffer(null);
  }

  function chooseCountry(country) {
    setSelectedOffer(rankOffers(country.continent, country)[0] || null);
    setSelectedRegion(country.continent);
    setSelectedCountry(country);
    setSearch("");
    setHoveredOffer(null);
  }

  function comparisonCopy(offer) {
    if (!offer) return "Select a country to see its checked package prices.";
    if (!hasCurrentPrice(offer)) return "Confirm this provider’s country coverage, allowance, validity and price before buying.";
    const equivalent = rankedOffers.filter(item => item.brand !== offer.brand && samePackage(item, offer));
    return `${offer.dataLabel} · ${validityText(offer)} · ${priceText(offer)}. ${checkedText(offer)}. ${equivalent.length ? "Other displayed packages with the same allowance, validity and currency can be compared directly." : "Other offers may have different allowances, durations or currencies."}`;
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
          <HeadingReadMore href="#map-workspace" label="Open the index">Choose a continent and destination to inspect published allowances, validity and starting prices.</HeadingReadMore>
        </div>
        <p className="coverageCount">
          <strong>{mapCountries.length}</strong>
          <span>mapped destinations</span>
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

      <div className={`mapWorkspace ${selectedRegion ? "isExploring" : ""}`} id="map-workspace">
        <div className="mapCanvas">
          {selectedRegion && (
            <section className="mapPlanOverlay" aria-labelledby="regional-options-title">
              <h3 className="srOnly" id="regional-options-title">Country eSIM options for {regionLabels[selectedRegion]}</h3>
              <p>{selectedCountry ? "Country packages" : "Choose a country"}<span>Matched plan details</span></p>
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
                    <span className="brandName"><i />{offer.brand}{selectedCountry && <em>{`#${index + 1}`}</em>}</span>
                    <strong>{priceText(offer)}</strong>
                    <small>{offer.product}</small>
                  </button></li>
                ))}
                {!rankedOffers.length && <li className="noOffers">Select a country to view packages.</li>}
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
            role="img"
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
                <strong>{priceText(selectedOffer)}</strong>
              </header>
              <dl>
                <div><dt>Allowance</dt><dd>{selectedOffer.dataLabel}</dd></div>
                <div><dt>Validity</dt><dd>{validityText(selectedOffer)}</dd></div>
                <div><dt>Network</dt><dd>{selectedOffer.network}</dd></div>
                <div><dt>Delivery</dt><dd>{brandFacts[selectedOffer.brand].delivery}</dd></div>
                <div><dt>Activation</dt><dd>{brandFacts[selectedOffer.brand].activation}</dd></div>
                <div><dt>Included</dt><dd>{brandFacts[selectedOffer.brand].extra}</dd></div>
              </dl>
              <footer>
                <span>{mapCountries.filter((country) => country.continent === selectedRegion).length} mapped destinations</span>
                <a href={selectedOffer.url} target="_blank" rel="noreferrer">{checkedText(selectedOffer)} · View provider ↗</a>
              </footer>
            </article>
          )}
          <div className="mapLegend" aria-hidden="true">
            <span><i className="legendAvailable" /> Selectable</span>
            <span><i className="legendSelected" /> Selected</span>
          </div>
          {!selectedRegion && (
            <p className="mapInstruction">Choose a continent above or select any country on the map.</p>
          )}
        </div>

        {selectedRegion && (
          <aside className="countryManifest" aria-live="polite">
            <div className="manifestHeader">
              <div>
                <p className="finderStep">Destination manifest</p>
                <h3>{regionLabels[selectedRegion]}</h3>
              </div>
              <span>{visibleCountries.length}</span>
            </div>

            <section className="manifestPlans" aria-labelledby="manifest-plans-title">
              <h4 className="srOnly" id="manifest-plans-title">Country eSIM plan options</h4>
              <ul>
              {rankedOffers.map((offer) => (
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
                  <span><strong><i />{offer.brand}</strong><small>{offer.product}</small></span>
                  <b>{priceText(offer)}</b>
                </button></li>
              ))}
              {!rankedOffers.length && <li className="noOffers">Select a country to compare prices</li>}
              </ul>
              <p>Prices use the displayed currency and package terms.</p>
            </section>

            <label className="countrySearch">
              <span className="srOnly">Search countries in {regionLabels[selectedRegion]}</span>
              <input
                type="search"
                placeholder="Search countries"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span aria-hidden="true">⌕</span>
            </label>

            <div className="countryList" role="group" aria-label={`Countries in ${regionLabels[selectedRegion]}`}>
              {visibleCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className={selectedCountry?.code === country.code ? "selected" : ""}
                  onClick={() => chooseCountry(country)}
                  aria-pressed={selectedCountry?.code === country.code}
                >
                  <span className="countryCode">{country.code}</span>
                  <span>{country.name}</span>
                  <span className="countryPrice">Compare plans</span>
                  <span className="countryArrow" aria-hidden="true">
                    {selectedCountry?.code === country.code ? "✓" : "⌁"}
                  </span>
                </button>
              ))}
              {!visibleCountries.length && <p className="noCountries">No matching destination.</p>}
            </div>

            {selectedCountry && (
              <div className="countryTicket">
                <span>Selected destination</span>
                <strong>{selectedCountry.name}</strong>
                <small>{selectedOffer ? `${selectedOffer.brand} ${selectedOffer.product} · ${priceText(selectedOffer)}` : "No comparable consumer plan found"}</small>
                {destinationByCode[selectedCountry.code]?.slug && <a href={sitePath(`/${destinationByCode[selectedCountry.code]?.slug}/`)}>Open the complete {selectedCountry.name} comparison <b aria-hidden="true">⌁</b></a>}
              </div>
            )}
          </aside>
        )}
      </div>
    </section>
  );
}
