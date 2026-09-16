import { destinationRegistry } from "./countryRegistry";
import { buildProviderPlanCatalog } from "./providerPlanCatalog";

const images = { Europe: "/images/france-esim-hero.jpg", Asia: "/images/japan-esim-hero.jpg", Africa: "/images/spain-esim-hero.jpg", "North America": "/images/united-states-esim-hero.jpg", "South America": "/images/spain-esim-hero.jpg", Oceania: "/images/japan-esim-hero.jpg" };

// Verified against Saily's public destination catalogue and destination pages
// on 2026-08-24. Prices are published USD starting prices for 1 GB / 7 days.
const destinations = [
  // Europe: with the dedicated France page, these nine make 10.
  ["italy","Italy","🇮🇹","IT","Europe","Rome","FCO",3.99],["spain","Spain","🇪🇸","ES","Europe","Madrid","MAD",3.99],["germany","Germany","🇩🇪","DE","Europe","Berlin","BER",4.49],["united-kingdom","United Kingdom","🇬🇧","GB","Europe","London","LHR",4.49],["portugal","Portugal","🇵🇹","PT","Europe","Lisbon","LIS",3.99],["greece","Greece","🇬🇷","GR","Europe","Athens","ATH",4.49],["netherlands","Netherlands","🇳🇱","NL","Europe","Amsterdam","AMS",3.99],["switzerland","Switzerland","🇨🇭","CH","Europe","Bern","ZRH",3.99],["austria","Austria","🇦🇹","AT","Europe","Vienna","VIE",1.99],
  ["japan","Japan","🇯🇵","JP","Asia","Tokyo","HND",3.99],["china","China","🇨🇳","CN","Asia","Beijing","PEK",4.49],["india","India","🇮🇳","IN","Asia","New Delhi","DEL",3.99],["thailand","Thailand","🇹🇭","TH","Asia","Bangkok","BKK",2.99],["indonesia","Indonesia","🇮🇩","ID","Asia","Jakarta","CGK",4.79],["vietnam","Vietnam","🇻🇳","VN","Asia","Hanoi","HAN",3.99],["south-korea","South Korea","🇰🇷","KR","Asia","Seoul","ICN",3.99],["singapore","Singapore","🇸🇬","SG","Asia","Singapore","SIN",3.99],["malaysia","Malaysia","🇲🇾","MY","Asia","Kuala Lumpur","KUL",3.99],["united-arab-emirates","United Arab Emirates","🇦🇪","AE","Asia","Abu Dhabi","AUH",8.99],
  ["turkey","Türkiye","🇹🇷","TR","Asia","Ankara","ESB",3.99],
  ["egypt","Egypt","🇪🇬","EG","Africa","Cairo","CAI",8.99],["morocco","Morocco","🇲🇦","MA","Africa","Rabat","RBA",8.99],["south-africa","South Africa","🇿🇦","ZA","Africa","Pretoria","JNB",3.99],["ghana","Ghana","🇬🇭","GH","Africa","Accra","ACC",6.99],["nigeria","Nigeria","🇳🇬","NG","Africa","Abuja","ABV",7.49],["algeria","Algeria","🇩🇿","DZ","Africa","Algiers","ALG",8.99],["tanzania","Tanzania","🇹🇿","TZ","Africa","Dodoma","DAR",4.49],["rwanda","Rwanda","🇷🇼","RW","Africa","Kigali","KGL",6.99],["mauritius","Mauritius","🇲🇺","MU","Africa","Port Louis","MRU",7.49],["mozambique","Mozambique","🇲🇿","MZ","Africa","Maputo","MPM",6.99],
  ["united-states","United States","🇺🇸","US","North America","Washington, D.C.","IAD",3.99],["canada","Canada","🇨🇦","CA","North America","Ottawa","YOW",5.29],["mexico","Mexico","🇲🇽","MX","North America","Mexico City","MEX",4.99],["costa-rica","Costa Rica","🇨🇷","CR","North America","San José","SJO",7.99],["panama","Panama","🇵🇦","PA","North America","Panama City","PTY",7.99],["guatemala","Guatemala","🇬🇹","GT","North America","Guatemala City","GUA",5.99],["dominican-republic","Dominican Republic","🇩🇴","DO","North America","Santo Domingo","SDQ",8.49],["jamaica","Jamaica","🇯🇲","JM","North America","Kingston","KIN",8.99],["el-salvador","El Salvador","🇸🇻","SV","North America","San Salvador","SAL",5.99],["honduras","Honduras","🇭🇳","HN","North America","Tegucigalpa","TGU",6.29],
  ["brazil","Brazil","🇧🇷","BR","South America","Brasília","BSB",3.99],["argentina","Argentina","🇦🇷","AR","South America","Buenos Aires","EZE",5.29],["chile","Chile","🇨🇱","CL","South America","Santiago","SCL",4.99],["colombia","Colombia","🇨🇴","CO","South America","Bogotá","BOG",4.99],["peru","Peru","🇵🇪","PE","South America","Lima","LIM",4.99],["uruguay","Uruguay","🇺🇾","UY","South America","Montevideo","MVD",7.99],["ecuador","Ecuador","🇪🇨","EC","South America","Quito","UIO",5.99],["bolivia","Bolivia","🇧🇴","BO","South America","Sucre","VVI",7.99],["paraguay","Paraguay","🇵🇾","PY","South America","Asunción","ASU",7.49],["guyana","Guyana","🇬🇾","GY","South America","Georgetown","GEO",6.99],
  ["australia","Australia","🇦🇺","AU","Oceania","Canberra","SYD",3.99],["new-zealand","New Zealand","🇳🇿","NZ","Oceania","Wellington","WLG",3.99],["fiji","Fiji","🇫🇯","FJ","Oceania","Suva","NAN",7.99],["papua-new-guinea","Papua New Guinea","🇵🇬","PG","Oceania","Port Moresby","POM",6.99],["tonga","Tonga","🇹🇴","TO","Oceania","Nukuʻalofa","TBU",4.99],["nauru","Nauru","🇳🇷","NR","Oceania","Yaren","INU",7.99],["samoa","Samoa","🇼🇸","WS","Oceania","Apia","APW",5.99],["guam","Guam","🇬🇺","GU","Oceania","Hagåtña","GUM",7.99,true],["french-polynesia","French Polynesia","🇵🇫","PF","Oceania","Papeete","PPT",15.99,true],["northern-mariana-islands","Northern Mariana Islands","🇲🇵","MP","Oceania","Saipan","SPN",7.99,true],
];

export const countryPages = Object.fromEntries(destinations.map(([slug,name,flag,code,region,city,airport,price,territory=false]) => [slug, {
  name, flag, code, region, city, airport, territory,
  heroImage: images[region], heroWidth: 1200, heroHeight: 630, heroPosition: "center 50%", heroAlt: `Travel eSIM comparison guide for ${name}`,
  heroSummary: `Compare verified travel eSIM plans for ${name}. Review data, validity, published prices, connection technology and activation terms before purchase.`,
  pickReason: `Saily is listed first because its official catalogue publishes a current ${name} offer and a traceable starting price.`,
  networks: `Saily connects through local partner networks in ${name}; the specific carrier can vary by plan and location.`,
  coverage: "Saily states that speed may be 3G, 4G, LTE or 5G depending on the local provider, device and location.",
  sourceUrl: `https://saily.com/esim-${slug}/`, sourceChecked: "2026-08-24", plans: buildProviderPlanCatalog(name, slug, price),
}]));

// Newly indexed destinations have planning guides, not invented commercial offers.
for (const destination of destinationRegistry) {
  if (destination.slug === "france" || countryPages[destination.slug]) continue;
  countryPages[destination.slug] = {
    ...destination,
    availability: "unverified",
    plans: [],
    updated: "2026-09-17",
  };
}
export const countrySlugs = Object.keys(countryPages);
