import { load } from 'cheerio';

function requireMatch(condition, message) { if (!condition) throw new Error(message); }
const numeric = value => Number(value);
function allowance(value) {
  const match = String(value).match(/^(\d+(?:\.\d+)?)\s*(GB|MB)$/i);
  return match ? Number(match[1]) / (match[2].toUpperCase() === 'MB' ? 1000 : 1) : null;
}
function decodeNuxt(table) {
  const seen = new Map();
  function decode(index) {
    if (index < 0) return null;
    if (seen.has(index)) return seen.get(index);
    const value = table[index];
    if (Array.isArray(value)) {
      if (typeof value[0] === 'string') {
        if (['Reactive','ShallowReactive','Ref','ShallowRef'].includes(value[0])) return decode(value[1]);
        return null;
      }
      const result=[]; seen.set(index,result); result.push(...value.map(decode)); return result;
    }
    if (value && typeof value === 'object') {
      const result={}; seen.set(index,result);
      for (const [key,ref] of Object.entries(value)) result[key]=decode(ref);
      return result;
    }
    return value;
  }
  return { root: decode(0), decode };
}
function astro(value) {
  if (!Array.isArray(value)) return value;
  const [type, data] = value;
  if (type === 1) return data.map(astro);
  if (type === 0 && data && typeof data === 'object') return Object.fromEntries(Object.entries(data).map(([k,v])=>[k,astro(v)]));
  return data;
}
function normalize(rows, source) {
  requireMatch(rows.length > 0, 'No matching packages found');
  const plans = rows.map(row=>({
    ...row, countryCode:source.code, currency:row.currency || 'USD', price:numeric(row.price), days:numeric(row.days),
    data:row.unlimited ? null : numeric(row.data), unlimited:Boolean(row.unlimited),
    sourceUrl:source.finalUrl || source.url, url:row.url || source.finalUrl || source.url,
    checkedAt:source.checkedAt, verification:'official-product-record',
  }));
  for (const row of plans) {
    requireMatch(row.id && row.days>0 && Number.isInteger(row.days) && row.price>0 && Number.isFinite(row.price), 'Incomplete package identity, validity or price');
    requireMatch(row.unlimited || (Number.isFinite(row.data) && row.data>0), 'Unknown package allowance');
  }
  return [...new Map(plans.map(p=>[p.id,p])).values()].sort((a,b)=>Number(a.unlimited)-Number(b.unlimited)||a.data-b.data||a.days-b.days||a.price-b.price);
}
export function parseProviderPage(provider, html, source) {
  requireMatch(source.status===200, `Provider returned HTTP ${source.status}`);
  const $ = load(html);
  let rows=[];
  if (provider==='nomad') {
    const context=JSON.parse($('#vike_pageContext').text());
    const entry=Object.entries(context.apiCache).find(([key])=>key.startsWith('product/getSingleCountryProduct-'))?.[1]?.data;
    requireMatch(entry?.coverage?.code===source.code, 'Nomad destination mismatch');
    for (const plan of entry.plans || []) {
      const product=plan.product, data=product?.service?.data, spec=product?.specification;
      if (!plan.is_published || product.coverage?.countries?.length!==1 || product.coverage.countries[0]!==source.code || spec?.duration_unit!=='DAY') continue;
      // Sale and account-specific pricing must be reviewed separately.
      if (plan.promotion?.is_on_sale || !plan.price?.USD) continue;
      if (plan.end_time && Date.parse(plan.end_time)<Date.parse(source.checkedAt)) continue;
      if (plan.start_time && Date.parse(plan.start_time)>Date.parse(source.checkedAt)) continue;
      rows.push({id:plan.id,price:plan.price.USD.amount,days:spec.duration,data:allowance(`${data.amount}${data.amount_unit}`),unlimited:data.is_unlimited,
        network:(data.mask_network || data.network || []).map(n=>`${n.name}${n.types?.length?' ('+n.types.join('/')+')':''}`).join(' / '),
        fairUse:data.is_unlimited?data.speed:null});
    }
  } else if (provider==='airalo') {
    const table=JSON.parse($('#__NUXT_DATA__').text());
    const {decode}=decodeNuxt(table);
    for (let i=0;i<table.length;i++) {
      const v=table[i]; if (!v || typeof v!=='object' || !('price' in v && 'day' in v && 'slug' in v)) continue;
      const p=decode(i);
      if (!p.is_stock || p.operator?.purchase_blocked?.value || p.type!=='sim') continue;
      if (!/^[A-Z]{3}$/.test(p.price?.currency?.code || '') || p.operator?.plan_type!=='data') continue;
      const countries=p.operator?.countries || [];
      if (countries.length!==1 || countries[0].apple_locale_region_code!==source.code) continue;
      if (p.promotions?.length) continue;
      rows.push({id:p.slug,currency:p.price.currency.code,price:p.price.amount,days:p.day,data:allowance(p.data_en),unlimited:p.is_unlimited,
        network:(p.operator.networks||[]).map(n=>`${n.network} (${n.service_type})`).join(' / '),fairUse:p.fair_usage_policy||null});
    }
  } else if (provider==='holafly') {
    const props=$('astro-island[props]').toArray().map(el=>JSON.parse($(el).attr('props'))).find(p=>p.variants);
    requireMatch(props, 'Holafly package variants missing');
    const variants=astro(props.variants);
    const name=$('h1').text().toLowerCase();
    requireMatch(name.includes(source.name.toLowerCase()) || source.slug==='turkey' && /turk|tür/.test(name), 'Holafly destination mismatch');
    const normalizeName=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/^the\s+/, '').replace(/[^a-z]/g,'');
    rows=variants.filter(p=>(normalizeName(p.name)===normalizeName(source.name) || normalizeName(p.name)===normalizeName(source.slug)) && p.currencies?.USD && [1,3,5,7,10,14,15,20,30,60,90].includes(p.days)).map(p=>({id:`${p.isocode}-${p.days}-${p.gigas}`,price:p.currencies.USD,days:p.days,unlimited:p.gigas==='unlimited',data:allowance(p.gigas),network:'Confirm local partner network',fairUse:'Unlimited data is subject to the provider’s fair-use and hotspot terms.'}));
  } else if (provider==='alosim') {
    requireMatch($(`h1 .flag-emoji-${source.code}`).length>0, 'aloSIM destination mismatch');
    const script=$('#manifest-js-extra').text();
    const theme=JSON.parse(script.match(/var themeVars = (\{[^\n]+\});/)?.[1] || '{}');
    rows=$('[data-package-id][data-package-days-count][data-package-gb]').toArray().map(el=>{
      const node=$(el),id=node.attr('data-package-id'),gb=node.attr('data-package-gb');
      return {id,price:theme.packagesPrice?.[id]?.USD,days:node.attr('data-package-days-count'),data:allowance(gb),unlimited:/unlimited/i.test(gb),network:'Confirm local partner network',fairUse:/unlimited/i.test(gb)?'Check the high-speed allowance and fair-use terms.':null};
    }).filter(p=>p.price && (p.unlimited || p.data));
  } else if (provider==='jetpac') {
    const chunks=[];
    $('script').each((i,el)=>{
      const match=$(el).text().match(/^self\.__next_f\.push\((\[.*\])\)$/s);
      if (match) { const record=JSON.parse(match[1]); if(record[0]===1) chunks.push(record[1]); }
    });
    let product;
    function inspect(value) {
      if (!value || typeof value!=='object') return;
      if (value.fixedPlanSections && value.pageFlag?.endsWith(`/${source.code.toLowerCase()}.svg`)) product=value;
      for (const child of Object.values(value)) inspect(child);
    }
    for(const line of chunks.join('').split('\n')) { try { inspect(JSON.parse(line.slice(line.indexOf(':')+1))); } catch {} }
    requireMatch(product && product.supportedCountries?.length===1, 'Jetpac destination mismatch');
    const packs=[...product.fixedPlanSections.flatMap(section=>section.plans),...product.unlimitedPacks];
    rows=packs.filter(pack=>!/(new customer|first|trial)/i.test(pack.badgeLabel || '')).flatMap(pack=>pack.durationOptions.filter(option=>option.currencyCode==='USD').map(option=>({
      id:option.catalogId,price:option.price,days:option.durationDays,data:option.dataInGB,unlimited:pack.kind==='unlimited',
      network:product.supportedCountries[0].operators.map(op=>op.operatorName).join(' / '),
      promotion:option.listPrice>option.price?'Published sale price; check eligibility at the provider.':null,
      fairUse:pack.kind==='unlimited'?'Check daily high-speed and fair-use limits at the provider.':null,
    })));
  } else { throw new Error(`No validated parser for ${provider}`); }
  return normalize(rows, source);
}
