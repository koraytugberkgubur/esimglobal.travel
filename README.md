# esimglobal.travel

Static-export Next.js launch page for `esimglobal.travel`.

## Local development

```bash
npm install
npm run dev
```

## Cloudflare Pages

- Framework preset: **Next.js (Static HTML Export)**
- Build command: `npm run build`
- Build output directory: `out`
- Node.js version: `20` or newer

The production build generates `out/index.html` and requires no server runtime.


## Destination coverage

`app/countryRegistry.js` is the country baseline: 193 UN members, Vatican City and
Palestine (195 countries), plus Taiwan, Kosovo and the existing Guam, French
Polynesia and Northern Mariana Islands territory guides. The 200 destinations are
used by the country-page generator and sitemap. The original homepage map is retained. UN M49
supplies the regional convention; Central America and the Caribbean are grouped
under North America. Antarctica is not counted as a country.

`app/countryPages.js` retains the original 61 comparison guides and adds 139
planning guides. New guides explicitly mark provider availability as unverified;
do not add a price, recommendation or Offer schema without a checked source.

After building, run `npm run verify:export` to check complete country coverage,
sitemap/export parity, country-page links, canonical URLs, structured data
and internal navigation. This check also runs before GitHub Pages deployment.

To reproduce the GitHub Pages build locally:

```bash
GITHUB_ACTIONS=true GITHUB_REPOSITORY=koraytugberkgubur/esimglobal.travel npm run build
npm run verify:export
```

The homepage layout and map have been restored to their version before the country
expansion. The 200 country pages and 210 sitemap entries are retained. Country
breadcrumb menus provide links to all guides in the corresponding continent.
`app/regionalChecks.js` supplies regional guidance for the planning pages.

## Provider price checks

Prices are checked snapshots of exact destination packages. `data/provider-prices.json`
records the source URL, source-check timestamp, package identity, country, allowance,
validity, native currency and total price. The map, comparison pages and Offer schema
use these same records. No exchange-rate conversion or regional-price substitution
is used. Budget filters require a single currency; unlimited data is kept separate
from fixed allowances and includes provider fair-use notes where available.

GitHub Pages deployments fetch the official Airalo, Holafly, Nomad, aloSIM and Jetpac
catalogues and match their product records before building. The manually triggered
**Check provider prices** workflow performs the same check and saves the snapshot
and report as a seven-day artifact, without deploying it.

Saily currently blocks the automated collector with HTTP 403. Its fixed-data prices
come from reviewed official tables in `data/saily-reviewed-prices.json`, including
the currency displayed by that source. Updating these requires reviewing the official
country page and recording the exact terms and actual review timestamp. The automated
refresh does **not** advance Saily's review dates. Unlimited Saily packages are omitted
until their duration can be verified. Unconfirmed sources remain provider links with
no price or Offer markup.

All quotes expire after seven days. The client checks the current time on load and
each minute, replacing expired prices with “Check provider price”; their original
check dates remain visible. Offer markup includes a matching expiry date. A fetch
failure never refreshes an old timestamp. A successful response that cannot be
matched, or a removed page, invalidates that provider's stored offers.

```bash
npm run test:prices
npm run prices:refresh -- --fetch
# Or parse a saved collector output directory:
npm run prices:refresh -- --source-dir=/path/to/source-directory
```

Inspect `data/price-check-report.json` for checks requiring review. Parser tests use
synthetic packages rather than pinning a provider's changing live price. Static-export
verification checks every structured offer against the matched source package.
