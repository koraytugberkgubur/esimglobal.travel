"use client";

import { useMemo, useState } from "react";
import { HeadingReadMore, HeadingSignal } from "../EditorialHeading";
import { francePlans } from "./plans";
import { matchesRequirements, primaryPlan, providerHighlights, validityText } from "../pricePolicy";

import { usePricePresentation } from "../PriceQuote";

const filterOptions = {
  data: [{ label: "Any data", value: 0 }, { label: "3 GB+", value: 3 }, { label: "5 GB+", value: 5 }, { label: "10 GB+", value: 10 }],
  days: [{ label: "Any validity", value: 0 }, { label: "7+ days", value: 7 }, { label: "14+ days", value: 14 }, { label: "30+ days", value: 30 }],
  price: [{ label: "Any price", value: 999 }, { label: "Under 10", value: 10 }, { label: "Under 20", value: 20 }, { label: "Under 30", value: 30 }],
};
function FilterGroup({ title, options, value, onChange }) {
  return <fieldset><legend>{title}</legend><div>{options.map(option=><button key={option.label} type="button" className={value===option.value?"active":""} onClick={()=>onChange(option.value)} aria-pressed={value===option.value}>{option.label}</button>)}</div></fieldset>;
}
function SourceNote({ plan }) {
  const { checkedText } = usePricePresentation();
  return <p className="planSourceNote"><span>{checkedText(plan)}</span>{plan.fairUse && <span>{plan.fairUse}</span>}{plan.promotion && <span>{plan.promotion}</span>}<a href={plan.sourceUrl || plan.url} target="_blank" rel="noreferrer">Provider source ↗</a></p>;
}

export function HeroPlanStrip({ country, plans }) {
  const { now, priceText, checkedText, hasCurrentPrice } = usePricePresentation();
  const headingId=`top-plans-${country.toLowerCase().replaceAll(" ","-")}`;
  const highlights=providerHighlights(plans,now);
  return <section className="heroPlanBoard" aria-labelledby={headingId}>
    <header className="heroPlanBoardLabel"><span>PROVIDER OPTIONS</span><h2 id={headingId}><HeadingSignal />eSIM providers for {country}</h2><HeadingReadMore href="#plans" label="See providers">Check each package’s allowance, validity and currency. These offers have different terms.</HeadingReadMore><small>Source dates shown per plan</small></header>
    <ol className="heroPlanRail">{highlights.map((plan,index)=><li key={plan.id}><a href="#plans" style={{"--plan-color":plan.color}} aria-label={`${plan.brand}: ${plan.dataLabel}, ${validityText(plan)}, ${priceText(plan)}`}>
      <div className="heroPlanMeta"><span className="heroPlanRank">0{index+1}</span><small>{hasCurrentPrice(plan)?"Package matched":"Check provider"}</small></div>
      <div className="heroPlanProvider"><b><i />{plan.brand}</b><small>{checkedText(plan)}</small></div>
      <dl><div><dt>Data</dt><dd>{plan.dataLabel}</dd></div><div><dt>Valid</dt><dd>{validityText(plan)}</dd></div></dl>
      <div className="heroPlanFooter"><strong>{priceText(plan)}</strong><span className="heroPlanAction">Compare <em aria-hidden="true">⌁</em></span></div>
    </a></li>)}</ol>
  </section>;
}

export default function FrancePlans({ country="France", plans=francePlans }) {
  const { now, priceText, checkedText, hasCurrentPrice } = usePricePresentation();
  const [data,setData]=useState(0),[days,setDays]=useState(0),[price,setPrice]=useState(999);
  const [currency,setCurrency]=useState('all'),[provider,setProvider]=useState('all'),[type,setType]=useState('all'),[showAll,setShowAll]=useState(false);
  const bestPlan=primaryPlan(plans,now),highlights=providerHighlights(plans,now);
  const currencies=[...new Set(plans.filter(p=>hasCurrentPrice(p)).map(p=>p.currency))].sort();
  const filteredPlans=useMemo(()=>plans.filter(plan=>(provider==='all'||plan.brand===provider)&&matchesRequirements(plan,{data,days,price,currency,type,now})),[plans,provider,data,days,price,currency,type,now]);
  const visiblePlans=showAll?filteredPlans:filteredPlans.slice(0,12);
  function budgetChanged(value) { setPrice(value); if(value!==999&&currency==='all')setCurrency(currencies.includes('USD')?'USD':currencies[0]||'USD'); setShowAll(false); }
  return <>
    <section className="bestPickPanel" aria-labelledby="best-pick-title" style={{"--plan-color":bestPlan.color}}>
      <div className="bestPickLead"><div className="bestPickSeal"><span>PLAN DETAILS</span><b>01</b></div><p className="routeKicker">PACKAGE DETAILS</p><h2 id="best-pick-title"><HeadingSignal />A {country} option from <em>{bestPlan.brand}</em></h2><HeadingReadMore href="#plans" label="Review all packages">This price belongs to the allowance and validity shown here. Compare equivalent packages in the same currency before choosing.</HeadingReadMore><a href={bestPlan.url} target="_blank" rel="noreferrer">View this provider <span aria-hidden="true">↗</span></a></div>
      <div className="bestPickReasons"><header><span>Total package price</span><strong>{priceText(bestPlan)}</strong></header>
        {[{title:'Data allowance',text:bestPlan.dataLabel},{title:'Plan validity',text:validityText(bestPlan)},{title:'Network',text:bestPlan.network}].map((item,i)=><article key={item.title}><span>0{i+1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><i aria-hidden="true">⌁</i></article>)}
        <SourceNote plan={bestPlan}/>
      </div>
    </section>
    <section className="commercialComparison" aria-labelledby="commercial-comparison-title">
      <header><div><p className="routeKicker">MATCHED PROVIDER PACKAGES</p><h2 id="commercial-comparison-title"><HeadingSignal />Compare {country} eSIM offers</h2></div><p>Total package prices in the currency shown. Allowances and validity differ; filter below to match your trip.</p></header>
      <ol className="commercialPlanList">{highlights.map((plan,index)=><li key={plan.id}><article style={{"--plan-color":plan.color}}>
        <div className="commercialProvider"><span>{String(index+1).padStart(2,'0')}</span><div><strong><i/>{plan.brand}</strong><small>{plan.note}</small></div></div>
        <div><span>Plan</span><strong>{plan.product}</strong></div><div><span>Data</span><strong>{plan.dataLabel}</strong></div><div><span>Validity</span><strong>{validityText(plan)}</strong></div><div><span>Network</span><strong>{plan.network}</strong></div><div className="commercialPrice"><span>Package total</span><strong>{priceText(plan)}</strong></div>
        <a href={plan.url} target="_blank" rel="noreferrer" aria-label={`View ${plan.brand}: ${plan.dataLabel}, ${validityText(plan)} for ${country}`}>View provider <span aria-hidden="true">↗</span></a>
      </article><SourceNote plan={plan}/></li>)}</ol>
      <footer>Choose the same data allowance, validity and currency on the provider’s page. Prices are checked snapshots, not checkout quotes. Taxes, promotions and fair-use terms may vary. Quotes older than seven days require rechecking.</footer>
    </section>
    <section className="francePlanExplorer" id="plans" aria-labelledby="plans-title">
      <header><div><p className="routeKicker">MATCH YOUR REQUIREMENTS</p><h2 id="plans-title"><HeadingSignal />Find a {country} eSIM for your trip</h2><HeadingReadMore href="#country-essentials" label="Connection guide">Match allowance, validity and currency. Unlimited plans may reduce speed after a daily allowance.</HeadingReadMore></div><span>{filteredPlans.length} matching packages</span></header>
      <div className="planSelectors">
        <label>Provider<select aria-label="Provider" value={provider} onChange={e=>{setProvider(e.target.value);setShowAll(false)}}><option value="all">All providers</option>{highlights.map(p=><option key={p.brand}>{p.brand}</option>)}</select></label>
        <label>Currency<select aria-label="Currency" value={currency} onChange={e=>{setCurrency(e.target.value);setPrice(999);setShowAll(false)}}><option value="all">All currencies</option>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>
        <label>Data type<select aria-label="Data type" value={type} onChange={e=>{setType(e.target.value);setShowAll(false)}}><option value="all">All packages</option><option value="fixed">Fixed data</option><option value="unlimited">Unlimited data</option></select></label>
      </div>
      <div className="planFilters"><FilterGroup title="Minimum data" options={filterOptions.data} value={data} onChange={v=>{setData(v);setShowAll(false)}}/><FilterGroup title="Minimum validity" options={filterOptions.days} value={days} onChange={v=>{setDays(v);setShowAll(false)}}/><FilterGroup title={`Maximum package price${currency==='all'?` (selects ${currencies.includes('USD')?'USD':currencies[0]||'USD'})`:` (${currency})`}`} options={filterOptions.price} value={price} onChange={budgetChanged}/></div>
      <ol className="planResults" aria-live="polite" aria-label={`${country} eSIM search results`}>{visiblePlans.map(plan=><li key={plan.id}><article style={{"--plan-color":plan.color}}>
        <div className="providerName"><i/>{plan.brand}<small>{checkedText(plan)}</small></div><div><span>Product</span><strong>{plan.product}</strong></div><div><span>Data</span><strong>{plan.dataLabel}</strong></div><div><span>Validity</span><strong>{validityText(plan)}</strong></div><div><span>Network</span><strong>{plan.network}</strong></div><div className="resultPrice"><span>Package total</span><strong>{priceText(plan)}</strong></div><a className="resultArrow" href={plan.url} target="_blank" rel="noreferrer" aria-label={`View ${plan.brand} ${plan.dataLabel} ${validityText(plan)} offer`}>↗</a>
      </article>{(plan.fairUse||plan.promotion)&&<p className="planSourceNote">{plan.fairUse} {plan.promotion}</p>}</li>)}
      {!filteredPlans.length&&<li className="noPlanResults">No checked packages match these requirements. Try another currency, provider or allowance.</li>}</ol>
      {filteredPlans.length>12&&<button type="button" className="showMorePlans" onClick={()=>setShowAll(!showAll)}>{showAll?'Show fewer packages':`Show all ${filteredPlans.length} matching packages`}</button>}
    </section>
  </>;
}
