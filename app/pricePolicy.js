export const PRICE_MAX_AGE_DAYS = 7;
export function hasCurrentPrice(plan, now = Date.now()) {
  const checked = Date.parse(plan?.checkedAt);
  const age = now - checked;
  return Boolean(plan?.verification && plan?.countryCode && /^[A-Z]{3}$/.test(plan?.currency || '')
    && Number.isFinite(plan.price) && plan.price > 0 && Number.isInteger(plan.days) && plan.days > 0
    && (plan.unlimited || (Number.isFinite(plan.data) && plan.data > 0))
    && Number.isFinite(checked) && age >= -300000 && age <= PRICE_MAX_AGE_DAYS * 86400000);
}
export function priceText(plan, now = Date.now()) {
  return hasCurrentPrice(plan, now) ? `${plan.currency} ${plan.price.toFixed(2)}` : 'Check provider price';
}
export function checkedText(plan, now = Date.now()) {
  if (!plan?.checkedAt) return 'Price not confirmed';
  const date = new Date(plan.checkedAt).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
  return hasCurrentPrice(plan, now) ? `Checked ${date}` : `Last checked ${date} · recheck needed`;
}
export function validityText(plan) { return plan.days ? `${plan.days} ${plan.days === 1 ? 'day' : 'days'}` : 'Confirm validity'; }
export function samePackage(a, b) {
  return hasCurrentPrice(a) && hasCurrentPrice(b) && !a.unlimited && !b.unlimited
    && a.countryCode === b.countryCode && a.currency === b.currency && a.data === b.data && a.days === b.days;
}
export function matchesRequirements(plan, { data = 0, days = 0, price = 999, type = 'all', currency = 'all', now = Date.now() } = {}) {
  if (currency !== 'all' && plan.currency !== currency) return false;
  if (type === 'fixed' && (plan.unlimited || !plan.data)) return false;
  if (type === 'unlimited' && !plan.unlimited) return false;
  if (data && !plan.unlimited && !(plan.data >= data)) return false;
  if (days && !(plan.days >= days)) return false;
  if (price !== 999 && (currency==='all' || !hasCurrentPrice(plan, now) || !(plan.price < price))) return false;
  return true;
}
export function providerHighlights(plans, now = Date.now()) {
  const brands = [...new Set(plans.map(plan=>plan.brand))];
  return brands.map(brand=>plans.filter(p=>p.brand===brand).sort((a,b)=>Number(hasCurrentPrice(b, now))-Number(hasCurrentPrice(a, now)) || Number(a.unlimited)-Number(b.unlimited) || (a.price??Infinity)-(b.price??Infinity))[0]);
}
export function primaryPlan(plans, now = Date.now()) {
  return plans.find(p=>p.brand==='Saily' && hasCurrentPrice(p, now) && !p.unlimited)
    || plans.find(p=>hasCurrentPrice(p, now) && !p.unlimited) || plans.find(p=>hasCurrentPrice(p, now)) || plans[0];
}
