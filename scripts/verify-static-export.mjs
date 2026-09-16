import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { destinationRegistry, countryCodesByContinent } from '../app/countryRegistry.js';

const codes = Object.values(countryCodesByContinent).flat();
assert.equal(codes.length, 195, 'UN country baseline');
assert.equal(new Set(codes).size, 195, 'Country codes must be unique');
assert.equal(destinationRegistry.length, 200, '195 countries and five additional destinations');
assert.equal(new Set(destinationRegistry.map(d => d.slug)).size, 200, 'Unique destination routes');
const expectedCountryCounts = { Europe: 44, Asia: 48, Africa: 54, 'North America': 23, 'South America': 12, Oceania: 14 };
for (const [region, count] of Object.entries(expectedCountryCounts)) assert.equal(countryCodesByContinent[region].length, count, region);

const sitemap = readFileSync('out/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(urls.length, 210, '200 destinations, nine editorial guides, homepage');
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap entries');
const base = urls[0];
assert.ok(base.endsWith('/'), 'Sitemap begins with the canonical homepage');
const home = readFileSync('out/index.html', 'utf8');
assert.ok(!home.includes('class="destinationDirectory"'), 'No standalone country directory');
assert.ok(home.includes('Browse destination guides'), 'The map contains the destination browser');
const basePath = new URL(base).pathname.replace(/\/$/, '');
let planningPages = 0;
let localLinksChecked = 0;
for (const destination of destinationRegistry) {
  const url = `${base}${destination.slug}/`;
  assert.ok(urls.includes(url), `Missing sitemap URL: ${url}`);
  const file = `out/${destination.slug}/index.html`;
  assert.ok(existsSync(file), `Missing export: ${file}`);
  assert.ok(home.includes(`href="${basePath}/${destination.slug}/"`), `Homepage must link ${destination.slug}`);
  const html = readFileSync(file, 'utf8');
  assert.ok(html.includes(`<link rel="canonical" href="${url}"`), `Canonical mismatch: ${file}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One main heading: ${file}`);
  assert.ok(!/\$(?:Infinity|NaN)|href="[^"]*undefined/.test(html), `Invalid price or URL: ${file}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
  assert.ok(schemas.length, `Missing structured data: ${file}`);
  if (html.includes('Provider availability needs confirmation')) {
    planningPages++;
    for (const schema of schemas) assert.ok(!JSON.stringify(schema).includes('"@type":"Offer"'), `Unverified offer schema: ${file}`);
  }
  for (const match of html.matchAll(/href="([^"#]+)"/g)) {
    const href = match[1].split('#')[0].split('?')[0];
    if (!href.startsWith(`${basePath}/`) || href.startsWith('//')) continue;
    const relative = href.slice(basePath.length);
    const target = `out${relative}${relative.endsWith('/') ? 'index.html' : ''}`;
    assert.ok(existsSync(target), `Broken internal link ${href} on ${file}`);
    localLinksChecked++;
  }
}
assert.equal(planningPages, 139, '139 new planning guides');
console.log(`PASS: 195-country baseline, 200 destination pages, 210 sitemap URLs, 139 honest availability states, ${localLinksChecked} internal links, canonical URLs and structured data.`);
