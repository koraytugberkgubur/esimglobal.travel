import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hasCurrentPrice, matchesRequirements, priceText, samePackage } from '../app/pricePolicy.js';
import { parseProviderPage } from './provider-price-parsers.mjs';
const now=Date.now();
const plan={id:'test-plan',countryCode:'DE',currency:'USD',data:1,days:7,price:4.49,checkedAt:new Date(now).toISOString(),verification:'official-product-record'};
const source={status:200,code:'DE',name:'Germany',slug:'germany',url:'https://www.nomadesim.com/germany-eSIM',checkedAt:plan.checkedAt};

test('unknown, incomplete, stale and future quotes cannot be shown as current',()=>{
  assert.ok(hasCurrentPrice(plan,now));
  for(const change of [{price:null},{price:0},{currency:null},{data:null},{days:0},{verification:null},{checkedAt:'invalid'},{checkedAt:new Date(now-8*86400000).toISOString()},{checkedAt:new Date(now+86400000).toISOString()}]){
    assert.equal(hasCurrentPrice({...plan,...change},now),false);
    assert.equal(priceText({...plan,...change},now),'Check provider price');
  }
});
test('like-for-like comparison requires the same country, currency, data and duration',()=>{
  assert.ok(samePackage(plan,{...plan,price:4.5}));
  for(const change of [{countryCode:'FR'},{currency:'CAD'},{data:3},{days:3},{unlimited:true}]) assert.equal(samePackage(plan,{...plan,...change}),false);
});
test('budgets never mix currencies or include unknown prices; thresholds are strict',()=>{
  assert.ok(matchesRequirements(plan,{currency:'USD',price:10,days:7}));
  assert.equal(matchesRequirements({...plan,currency:'CAD'},{currency:'USD',price:10}),false);
  assert.equal(matchesRequirements(plan,{price:10}),false);
  assert.equal(matchesRequirements({...plan,price:10},{currency:'USD',price:10}),false);
  assert.equal(matchesRequirements({...plan,price:null},{currency:'USD',price:10}),false);
  assert.equal(matchesRequirements({...plan,days:3},{days:7}),false);
  assert.equal(matchesRequirements(plan,{data:3}),false);
  assert.ok(matchesRequirements({...plan,data:null,unlimited:true},{data:10,type:'unlimited'}));
});
function nomadDocument(code='DE',coverage=['DE'],amount=1,currency='USD'){
 const data={coverage:{code},plans:[{id:'sku-1',is_published:true,price:{[currency]:{amount:4.5}},promotion:{},product:{coverage:{countries:coverage},service:{data:{amount,amount_unit:'GB',is_unlimited:false}},specification:{duration:7,duration_unit:'DAY'}}}]};
 return `<script id="vike_pageContext" type="application/json">${JSON.stringify({apiCache:{'product/getSingleCountryProduct-test':{data}}})}</script>`;
}
test('parser rejects failed sources, wrong destinations, regional substitutes and missing USD quotes',()=>{
 const parsed=parseProviderPage('nomad',nomadDocument(),source);
 assert.equal(parsed[0].price,4.5);assert.equal(parsed[0].data,1);assert.equal(parsed[0].days,7);
 for(const html of [nomadDocument('FR'),nomadDocument('DE',['DE','FR']),nomadDocument('DE',['DE'],null),nomadDocument('DE',['DE'],1,'CAD'),'<html>Challenge page</html>']) assert.throws(()=>parseProviderPage('nomad',html,source));
 assert.throws(()=>parseProviderPage('nomad',nomadDocument(),{...source,status:403}));
});
test('Holafly duration belongs to its exact variant, not the banner starting price',()=>{
 const variant={name:[0,'Germany'],isocode:[0,'DEU'],days:[0,7],gigas:[0,'unlimited'],currencies:[0,{USD:[0,27.5],EUR:[0,25.5]}]};
 const props=JSON.stringify({variants:[1,[[0,variant]]]}).replaceAll('"','&quot;');
 const html=`<h1>eSIM for Germany</h1><p>From USD 3.90</p><astro-island props="${props}"></astro-island>`;
 const parsed=parseProviderPage('holafly',html,{...source,url:'https://esim.holafly.com/esim-germany/'});
 assert.equal(parsed[0].price,27.5);assert.equal(parsed[0].days,7);assert.equal(parsed[0].unlimited,true);
 assert.throws(()=>parseProviderPage('holafly',html.replace('&quot;Germany&quot;','&quot;France&quot;'),source));
});
test('stored quotes have source identities, valid currencies and exact package terms',()=>{
 const snapshot=JSON.parse(readFileSync('data/provider-prices.json'));
 const seen=new Set();let count=0;
 for(const [slug,destination] of Object.entries(snapshot.destinations))for(const [provider,record]of Object.entries(destination.providers))for(const p of record.plans){
   const key=[slug,provider,p.id,p.currency].join('/');assert.ok(!seen.has(key),key);seen.add(key);
   assert.ok(p.price>0&&Number.isFinite(p.price));assert.ok(p.days>0&&Number.isInteger(p.days));assert.ok(p.unlimited || p.data>0);
   assert.match(p.currency,/^[A-Z]{3}$/);assert.ok(Number.isFinite(Date.parse(p.checkedAt)));assert.ok(p.verification);assert.match(p.sourceUrl,/^https:\/\//);count++;
 }
 assert.ok(count>100);
});
