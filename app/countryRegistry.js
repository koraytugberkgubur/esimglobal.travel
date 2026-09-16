import { countries, getEmojiFlag } from "countries-list";

// 193 UN members plus the Holy See (VA) and Palestine (PS).
// Grouping follows UN M49: Russia in Europe, Cyprus and Timor-Leste in Asia;
// Northern America, Central America and the Caribbean form North America here.
// https://www.un.org/en/about-us/member-states
// https://www.un.org/en/about-us/non-member-states
// https://unstats.un.org/unsd/methodology/m49/
export const countryCodesByContinent = {
  Europe: "AL AD AT BY BE BA BG HR CZ DK EE FI FR DE GR VA HU IS IE IT LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB".split(" "),
  Asia: "AF AM AZ BH BD BT BN KH CN CY GE IN ID IR IQ IL JP JO KZ KW KG LA LB MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TJ TH TL TR TM AE UZ VN YE".split(" "),
  Africa: "DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW".split(" "),
  "North America": "AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US".split(" "),
  "South America": "AR BO BR CL CO EC GY PY PE SR UY VE".split(" "),
  Oceania: "AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU".split(" "),
};
export const continentNames = Object.keys(countryCodesByContinent);
export const continentCode = { Europe: "EU", Asia: "AS", Africa: "AF", "North America": "NA", "South America": "SA", Oceania: "OC" };
export const continentSlug = (name) => name.toLowerCase().replaceAll(" ", "-");
const extras = [
  ["XK", "Europe", "Additional destination"],
  ["TW", "Asia", "Additional destination"],
  ["GU", "Oceania", "Territory"],
  ["PF", "Oceania", "Territory"],
  ["MP", "Oceania", "Territory"],
];
const overrides = {
  TR: { name: "Türkiye", slug: "turkey" },
  TL: { name: "Timor-Leste", slug: "timor-leste" },
  CI: { name: "Côte d’Ivoire", slug: "cote-divoire" },
  ST: { name: "São Tomé and Príncipe", slug: "sao-tome-and-principe" },
  FM: { name: "Micronesia", slug: "micronesia" },
};
export const destinationRegistry = [
  ...Object.entries(countryCodesByContinent).flatMap(([region, codes]) => codes.map((code) => [code, region, "Country"])),
  ...extras,
].map(([code, region, kind]) => {
  const record = countries[code];
  if (!record) throw new Error(`Missing country metadata: ${code}`);
  const name = overrides[code]?.name || record.name;
  const slug = overrides[code]?.slug || name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return { code, name, slug, region, continent: continentCode[region], kind, flag: getEmojiFlag(code), phone: record.phone, territory: kind === "Territory" };
}).sort((a, b) => a.name.localeCompare(b.name, "en"));
export const destinationByCode = Object.fromEntries(destinationRegistry.map((destination) => [destination.code, destination]));
