"use client";

import { useState } from "react";
import { destinationRegistry, continentNames, continentSlug } from "./countryRegistry";
import { sitePath } from "./sitePath";

export default function DestinationDirectory() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLocaleLowerCase("en");
  const matches = destinationRegistry.filter((item) => `${item.name} ${item.code} ${item.slug}`.toLocaleLowerCase("en").includes(search));
  return (
    <section className="destinationDirectory" id="destinations" aria-labelledby="directory-title">
      <header><p className="routeKicker">THE COMPLETE DESTINATION DIRECTORY</p><h2 id="directory-title">Find your country guide</h2>
        <p>Browse {destinationRegistry.length} destination guides across six inhabited continents. A guide’s presence does not confirm that an eSIM provider currently serves that destination.</p></header>
      <label className="directorySearch">Search all destinations<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Country name or code, e.g. Kenya or KE" /></label>
      <p aria-live="polite">{matches.length} destinations</p>
      <nav className="directoryRegions" aria-label="Jump to a continent">{continentNames.map((region) => <a key={region} href={`#destinations-${continentSlug(region)}`}>{region}</a>)}</nav>
      <div className="directoryGrid">{continentNames.map((region) => {
        const entries = matches.filter((item) => item.region === region);
        return <section key={region} id={`destinations-${continentSlug(region)}`}><h3>{region} <span>{entries.length}</span></h3>
          <ul>{entries.map((item) => <li key={item.code}><a href={sitePath(`/${item.slug}/`)}><span aria-hidden="true">{item.flag}</span> {item.name}{item.kind !== "Country" && <small>{item.kind}</small>}</a></li>)}</ul>
          {!entries.length && <p>No matching destinations in this continent.</p>}
        </section>;
      })}</div>
      <aside className="directoryScope"><h3>What the directory includes</h3><p>The country baseline is the UN’s 193 member states plus its two observer states, represented here by Vatican City and Palestine. Taiwan and Kosovo are listed as additional travel destinations. Guam, French Polynesia and the Northern Mariana Islands retain their territory guides. Continent grouping follows UN M49, with Central America and the Caribbean grouped under North America.</p>
        <p><strong>Antarctica:</strong> there are no sovereign countries to add. For an expedition, confirm onboard and shore connectivity with your operator; a regional travel eSIM should not be assumed to provide coverage there.</p>
        <p><a href="https://www.un.org/en/about-us/member-states">UN member states</a> · <a href="https://www.un.org/en/about-us/non-member-states">Observer states</a> · <a href="https://unstats.un.org/unsd/methodology/m49/">Geographic grouping</a> · <a href="https://www.ats.aq/e/antarctictreaty.html">Antarctic Treaty</a></p>
      </aside>
    </section>
  );
}
