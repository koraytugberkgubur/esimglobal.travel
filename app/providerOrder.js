// Provider order for destinations outside the priority set.
//
// The catalogue lists providers in a fixed order, which puts the same brand
// first on every page. On these destinations the order is rotated instead, so
// no single provider leads every guide.
//
// The shuffle is seeded from the destination slug, not from the clock or the
// build, so a destination keeps the same order across builds and the exported
// HTML stays stable between deploys.

export const rotatedOrderSlugs = new Set([
  "afghanistan", "algeria", "antigua-and-barbuda", "armenia", "azerbaijan", "bahrain",
  "bangladesh", "barbados", "benin", "bolivia", "botswana", "brunei", "bulgaria",
  "burkina-faso", "cameroon", "central-african-republic", "chad", "cote-divoire",
  "democratic-republic-of-the-congo", "dominica", "estonia", "eswatini", "fiji", "finland",
  "gabon", "gambia", "grenada", "guinea", "guinea-bissau", "guyana", "haiti", "honduras",
  "iraq", "kuwait", "kyrgyzstan", "laos", "latvia", "lesotho", "liberia", "liechtenstein",
  "luxembourg", "malawi", "maldives", "mali", "mauritania", "moldova", "monaco", "mongolia",
  "mozambique", "nauru", "nepal", "nicaragua", "niger", "north-macedonia", "papua-new-guinea",
  "paraguay", "republic-of-the-congo", "rwanda", "saint-kitts-and-nevis", "saint-lucia",
  "saint-vincent-and-the-grenadines", "samoa", "san-marino", "senegal", "sierra-leone",
  "slovakia", "slovenia", "solomon-islands", "south-sudan", "sudan", "suriname", "tajikistan",
  "timor-leste", "togo", "tonga", "trinidad-and-tobago", "uganda", "ukraine", "uruguay",
  "vanuatu", "zambia"
]);

// Saily is placed second or third in the rotated order.
const sailySlots = [1, 2];

function seedFromSlug(slug) {
  let hash = 2166136261;
  for (let index = 0; index < slug.length; index += 1) {
    hash ^= slug.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = seed;
  return function next() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rotatedBrandOrder(brands, slug) {
  if (!rotatedOrderSlugs.has(slug) || brands.length < 2) return brands;
  const next = seededRandom(seedFromSlug(slug));
  const others = brands.filter((brand) => brand !== "Saily");
  for (let i = others.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  if (others.length === brands.length) return others;
  const slot = sailySlots[Math.floor(next() * sailySlots.length)];
  const ordered = others.slice();
  ordered.splice(Math.min(slot, ordered.length), 0, "Saily");
  return ordered;
}

export function rotatePlanOrder(plans, slug) {
  if (!rotatedOrderSlugs.has(slug) || !plans.length) return plans;
  const brands = [...new Set(plans.map((plan) => plan.brand))];
  const ordered = rotatedBrandOrder(brands, slug);
  return ordered.flatMap((brand) => plans.filter((plan) => plan.brand === brand));
}
