import { mkdir, writeFile } from 'node:fs/promises';

const sources = {
  saily: 'https://saily.com/esim-germany/',
  airalo: 'https://www.airalo.com/germany-esim',
  holafly: 'https://esim.holafly.com/esim-germany/',
  nomad: 'https://www.nomadesim.com/germany-eSIM',
  alosim: 'https://alosim.com/germany-esim/',
  jetpac: 'https://www.jetpacglobal.com/',
};
await mkdir('price-check', { recursive: true });
const results = await Promise.all(Object.entries(sources).map(async ([provider, url]) => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'Accept-Language': 'en-US,en;q=0.9' } });
    const html = await response.text();
    await writeFile(`price-check/${provider}.html`, html);
    return { provider, url, finalUrl: response.url, status: response.status, bytes: html.length, checkedAt: new Date().toISOString() };
  } catch (error) {
    return { provider, url, error: error.message };
  }
}));
await writeFile('price-check/sources.json', JSON.stringify(results, null, 2));
console.log(results);
