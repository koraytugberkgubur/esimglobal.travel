import snapshot from '../data/provider-prices.json';
import { destinationRegistry } from './countryRegistry.js';
import { hasCurrentPrice, validityText } from './pricePolicy.js';

export const catalogueProviders = [
  { key: 'saily', brand: 'Saily', url: 'https://saily.com/', color: '#3626a7' },
  { key: 'airalo', brand: 'Airalo', url: 'https://www.airalo.com/', color: '#ff6b4a' },
  { key: 'holafly', brand: 'Holafly', url: 'https://esim.holafly.com/', color: '#7b2dff' },
  { key: 'nomad', brand: 'Nomad', url: 'https://www.nomadesim.com/', color: '#2563eb' },
  { key: 'alosim', brand: 'aloSIM', url: 'https://alosim.com/', color: '#e11d48' },
  { key: 'jetpac', brand: 'Jetpac', url: 'https://www.jetpacglobal.com/', color: '#0891b2' },
];

export function buildProviderPlanCatalog(country, slug) {
  const code = destinationRegistry.find(d=>d.slug===slug)?.code;
  return catalogueProviders.flatMap(provider=>{
    const source = snapshot.destinations[slug]?.providers[provider.key];
    const records = (source?.plans || []).filter(p=>p.countryCode===code);
    const checked = records.filter(p=>hasCurrentPrice(p));
    if (checked.length) return checked.map(record=>({
      ...provider,...record,id:`${provider.key}-${code}-${record.id}`,
      product:`${country} · ${record.unlimited?'Unlimited':`${record.data} GB`} · ${validityText(record)}`,
      dataLabel:record.unlimited?'Unlimited':`${record.data} GB`,daysLabel:`${validityText(record)}`,
      note:'Matched provider package',network:record.network || 'Confirm local partner network',
    }));
    return [{...provider,id:`${provider.key}-${code || slug}-catalogue`,countryCode:code,
      product:`${country} catalogue`,data:null,dataLabel:'Check allowance',days:null,daysLabel:'Confirm validity',
      price:null,currency:null,network:'Confirm local partner network',note:records.length?'Price needs rechecking':'Price not confirmed',
      checkedAt:source?.checkedAt || null,sourceUrl:source?.sourceUrl || provider.url,
      url:source?.sourceUrl || provider.url,
    }];
  });
}
