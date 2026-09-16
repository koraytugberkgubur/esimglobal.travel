import { mkdir, readFile, writeFile } from 'node:fs/promises';
const destinations = JSON.parse(await readFile('data/price-destinations.json', 'utf8'));
const sources = {
  airalo: slug => `https://www.airalo.com/${slug}-esim`,
  holafly: slug => `https://esim.holafly.com/esim-${slug}/`,
  nomad: slug => `https://www.nomadesim.com/${slug}-eSIM`,
  alosim: slug => `https://alosim.com/${slug}-esim/`,
  jetpac: slug => `https://www.jetpacglobal.com/product-details/${slug}-esim`,
};
const jobs = destinations.flatMap(destination => Object.entries(sources).map(([provider, makeUrl]) => ({ ...destination, provider, url: makeUrl(destination.slug) })));
const results = [];
await mkdir('price-check', { recursive: true });
async function worker() {
  while (jobs.length) {
    const job = jobs.shift();
    try {
      const response = await fetch(job.url, { signal: AbortSignal.timeout(25000), headers: { 'Accept-Language': 'en-US,en;q=0.9' } });
      const html = await response.text();
      await mkdir(`price-check/${job.slug}`, { recursive: true });
      await writeFile(`price-check/${job.slug}/${job.provider}.html`, html);
      results.push({ ...job, finalUrl: response.url, status: response.status, bytes: html.length, checkedAt: new Date().toISOString() });
    } catch (error) { results.push({ ...job, error: error.message }); }
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
results.sort((a,b) => `${a.slug}/${a.provider}`.localeCompare(`${b.slug}/${b.provider}`));
await writeFile('price-check/sources.json', JSON.stringify(results, null, 2));
console.log(`${results.filter(r=>r.status===200).length}/${results.length} official source pages collected`);
