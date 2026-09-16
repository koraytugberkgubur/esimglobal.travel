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

`app/countryRegistry.js` is the directory baseline: 193 UN members, Vatican City and
Palestine (195 countries), plus Taiwan, Kosovo and the existing Guam, French
Polynesia and Northern Mariana Islands territory guides. The 200 destinations are
used by homepage search, map navigation and the country-page generator. UN M49
supplies the regional convention; Central America and the Caribbean are grouped
under North America. Antarctica is explained in the directory rather than counted
as a country.

`app/countryPages.js` retains the original 61 comparison guides and adds 139
planning guides. New guides explicitly mark provider availability as unverified;
do not add a price, recommendation or Offer schema without a checked source.

After building, run `npm run verify:export` to check complete country coverage,
sitemap/export parity, crawlable homepage links, canonical URLs, structured data
and internal navigation. This check also runs before GitHub Pages deployment.

To reproduce the GitHub Pages build locally:

```bash
GITHUB_ACTIONS=true GITHUB_REPOSITORY=KTG1/esimglobal.travel npm run build
npm run verify:export
```
