import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { destinationRegistry, countryCodesByContinent } from '../app/countryRegistry.js';
import { countryCoordinates } from '../app/countryCoordinates.js';
import { hasCurrentPrice, validityText, PRICE_MAX_AGE_DAYS } from '../app/pricePolicy.js';

const prices = JSON.parse(readFileSync('data/provider-prices.json', 'utf8'));
const providerNames = { saily: 'Saily', airalo: 'Airalo', holafly: 'Holafly', nomad: 'Nomad', alosim: 'aloSIM', jetpac: 'Jetpac' };
let offersChecked = 0;

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
assert.ok(!home.includes('integratedMap'), 'Original homepage map restored');
const basePath = new URL(base).pathname.replace(/\/$/, '');
function verifyFooter(html, slug) {
  const footer = html.match(/<footer class="atlasFooter"[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer, `Missing footer: ${slug}`);
  assert.ok(!footer.includes('<details'), `No expanded destination directory: ${slug}`);
  const navigation = footer.match(/<nav class="footerCountrySection"[\s\S]*?<\/nav>/)?.[0] || '';
  const links = [...navigation.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
  assert.equal(links.length, 6, `Six country links in footer: ${slug}`);
  assert.equal(new Set(links).size, 6, `Unique country links in footer: ${slug}`);
  assert.ok(!links.includes(`${basePath}/${slug}/`), `Footer must not link to current country: ${slug}`);
  assert.ok((footer.match(/<a\s/g) || []).length <= 13, `Footer link budget: ${slug}`);
  for (const href of links) assert.ok(existsSync(`out${href.slice(basePath.length)}index.html`), `Broken footer link: ${href}`);
  return links;
}
const featured = verifyFooter(home, 'home');
assert.deepEqual(featured, ['france', 'japan', 'south-africa', 'united-states', 'brazil', 'australia'].map(slug => `${basePath}/${slug}/`));
const nearbyExamples = {
  france: ['germany', 'italy', 'spain', 'belgium', 'switzerland', 'united-kingdom'],
  kenya: ['uganda', 'tanzania'],
  fiji: ['samoa'], // Across the international date line.
  egypt: ['israel'], // Across the site's continent grouping.
};
let planningPages = 0;
let localLinksChecked = 0;
for (const destination of destinationRegistry) {
  const url = `${base}${destination.slug}/`;
  assert.ok(urls.includes(url), `Missing sitemap URL: ${url}`);
  const file = `out/${destination.slug}/index.html`;
  assert.ok(existsSync(file), `Missing export: ${file}`);
  const html = readFileSync(file, 'utf8');
  const footerLinks = verifyFooter(html, destination.slug);
  for (const nearby of nearbyExamples[destination.slug] || []) {
    assert.ok(footerLinks.includes(`${basePath}/${nearby}/`), `Missing nearby footer destination ${nearby} on ${destination.slug}`);
  }
  const coordinates = countryCoordinates[destination.code];
  assert.ok(coordinates?.length === 2 && coordinates.every(Number.isFinite), `Missing geographic position: ${destination.code}`);
  assert.ok(Math.abs(coordinates[0]) <= 90 && Math.abs(coordinates[1]) <= 180, `Invalid geographic position: ${destination.code}`);
  assert.ok(html.includes(`<link rel="canonical" href="${url}"`), `Canonical mismatch: ${file}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One main heading: ${file}`);
  assert.ok(!/\$(?:Infinity|NaN)|href="[^"]*undefined/.test(html), `Invalid price or URL: ${file}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
  assert.ok(schemas.length, `Missing structured data: ${file}`);
  const services = schemas.flatMap(schema => schema['@graph'] || [])
    .filter(node => node['@type'] === 'ItemList')
    .flatMap(node => node.itemListElement || []).map(entry => entry.item);
  for (const service of services.filter(service => service?.offers)) {
    const provider = Object.keys(providerNames).find(key => providerNames[key] === service.provider?.name);
    const records = prices.destinations[destination.slug]?.providers[provider]?.plans || [];
    const matching = records.find(plan => {
      const product = `${destination.name} · ${plan.unlimited ? 'Unlimited' : `${plan.data} GB`} · ${validityText(plan)}`;
      return service.name === `${providerNames[provider]} ${product} eSIM plan`
        && service.offers.priceCurrency === plan.currency && Number(service.offers.price) === plan.price
        && service.offers.url === plan.url && plan.countryCode === destination.code && hasCurrentPrice(plan);
    });
    assert.ok(matching, `Unmatched structured offer: ${file}: ${service.name}`);
    assert.equal(service.offers.priceValidUntil, new Date(Date.parse(matching.checkedAt) + PRICE_MAX_AGE_DAYS * 86400000).toISOString().slice(0, 10));
    offersChecked++;
  }
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
console.log(`PASS: 195-country baseline, 200 destination pages, 210 sitemap URLs, 139 honest availability states, ${localLinksChecked} internal links, ${offersChecked} source-matched structured offers, six relevant footer destinations per page, canonical URLs and structured data.`);
