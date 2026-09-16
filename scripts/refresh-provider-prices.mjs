import { readFile, writeFile } from 'node:fs/promises';
import { parseProviderPage } from './provider-price-parsers.mjs';
const sourceDirectory = process.argv.find(arg=>arg.startsWith('--source-dir='))?.split('=')[1] || 'price-check';
if (process.argv.includes('--fetch')) await import('./collect-provider-pages.mjs');
const path='data/provider-prices.json';
const snapshot=JSON.parse(await readFile(path,'utf8'));
const sources=JSON.parse(await readFile(`${sourceDirectory}/sources.json`,'utf8'));
const report=[];
for (const source of sources) {
  try {
    if (source.status !== 200) throw new Error(source.error || `HTTP ${source.status}`);
    const html=await readFile(`${sourceDirectory}/${source.slug}/${source.provider}.html`,'utf8');
    const plans=parseProviderPage(source.provider,html,source);
    snapshot.destinations[source.slug] ||= {providers:{}};
    snapshot.destinations[source.slug].providers[source.provider]={status:'checked',sourceUrl:source.finalUrl,checkedAt:source.checkedAt,plans};
    report.push({slug:source.slug,provider:source.provider,status:'matched',plans:plans.length});
  } catch(error) {
    // Network failures keep the previous check date. A successful page that no
    // longer matches invalidates the quote instead of retaining a bad package.
    if (source.status === 200 || [404, 410].includes(source.status)) {
      if (snapshot.destinations[source.slug]) delete snapshot.destinations[source.slug].providers[source.provider];
    }
    report.push({slug:source.slug,provider:source.provider,status:'needs-review',reason:error.message});
  }
}
const reviews=JSON.parse(await readFile('data/saily-reviewed-prices.json','utf8'));
for(const [slug,source] of Object.entries(reviews)){
  if(!source.plans?.length) { report.push({slug,provider:'saily',status:'needs-review',reason:'No manually confirmed package'}); continue; }
  report.push({slug,provider:'saily',status:'manual-review',checkedAt:source.checkedAt,plans:source.plans.length});
  snapshot.destinations[slug] ||= {providers:{}};
  snapshot.destinations[slug].providers.saily={status:'checked',sourceUrl:source.sourceUrl,checkedAt:source.checkedAt,
    plans:source.plans.map(p=>({...p,id:`${source.code}-${p.data}gb-${p.days}d`,countryCode:source.code,currency:source.currency,unlimited:false,
      url:`https://saily.com/esim-${slug}/`,sourceUrl:source.sourceUrl,checkedAt:source.checkedAt,verification:'official-page-review',network:'3G / 4G / LTE / 5G'}))};
}
snapshot.generatedAt=new Date().toISOString();
await writeFile(path,JSON.stringify(snapshot,null,2)+'\n');
await writeFile('data/price-check-report.json',JSON.stringify({checkedAt:snapshot.generatedAt,results:report},null,2)+'\n');
console.log(`${report.filter(r=>r.status==='matched').length} automated catalogues matched; ${report.filter(r=>r.status==='manual-review').length} manually reviewed Saily catalogues retained; ${report.filter(r=>r.status==='needs-review').length} checks need review. Failed checks never refresh old dates.`);
