import { destinationRegistry } from "./countryRegistry";
import { buildProviderPlanCatalog } from "./providerPlanCatalog";
import { rotatePlanOrder } from "./providerOrder";

const images = { Europe: "/images/france-esim-hero.jpg", Asia: "/images/japan-esim-hero.jpg", Africa: "/images/spain-esim-hero.jpg", "North America": "/images/united-states-esim-hero.jpg", "South America": "/images/spain-esim-hero.jpg", Oceania: "/images/japan-esim-hero.jpg" };

// Destination presentation metadata. Prices come only from checked provider records.
const destinations = [
  // Europe: with the dedicated France page, these nine make 10.
  ["italy","Italy","🇮🇹","IT","Europe","Rome","FCO"],["spain","Spain","🇪🇸","ES","Europe","Madrid","MAD"],["germany","Germany","🇩🇪","DE","Europe","Berlin","BER"],["united-kingdom","United Kingdom","🇬🇧","GB","Europe","London","LHR"],["portugal","Portugal","🇵🇹","PT","Europe","Lisbon","LIS"],["greece","Greece","🇬🇷","GR","Europe","Athens","ATH"],["netherlands","Netherlands","🇳🇱","NL","Europe","Amsterdam","AMS"],["switzerland","Switzerland","🇨🇭","CH","Europe","Bern","ZRH"],["austria","Austria","🇦🇹","AT","Europe","Vienna","VIE"],
  ["japan","Japan","🇯🇵","JP","Asia","Tokyo","HND"],["china","China","🇨🇳","CN","Asia","Beijing","PEK"],["india","India","🇮🇳","IN","Asia","New Delhi","DEL"],["thailand","Thailand","🇹🇭","TH","Asia","Bangkok","BKK"],["indonesia","Indonesia","🇮🇩","ID","Asia","Jakarta","CGK"],["vietnam","Vietnam","🇻🇳","VN","Asia","Hanoi","HAN"],["south-korea","South Korea","🇰🇷","KR","Asia","Seoul","ICN"],["singapore","Singapore","🇸🇬","SG","Asia","Singapore","SIN"],["malaysia","Malaysia","🇲🇾","MY","Asia","Kuala Lumpur","KUL"],["united-arab-emirates","United Arab Emirates","🇦🇪","AE","Asia","Abu Dhabi","AUH"],
  ["turkey","Türkiye","🇹🇷","TR","Asia","Ankara","ESB"],
  ["egypt","Egypt","🇪🇬","EG","Africa","Cairo","CAI"],["morocco","Morocco","🇲🇦","MA","Africa","Rabat","RBA"],["south-africa","South Africa","🇿🇦","ZA","Africa","Pretoria","JNB"],["ghana","Ghana","🇬🇭","GH","Africa","Accra","ACC"],["nigeria","Nigeria","🇳🇬","NG","Africa","Abuja","ABV"],["algeria","Algeria","🇩🇿","DZ","Africa","Algiers","ALG"],["tanzania","Tanzania","🇹🇿","TZ","Africa","Dodoma","DAR"],["rwanda","Rwanda","🇷🇼","RW","Africa","Kigali","KGL"],["mauritius","Mauritius","🇲🇺","MU","Africa","Port Louis","MRU"],["mozambique","Mozambique","🇲🇿","MZ","Africa","Maputo","MPM"],
  ["united-states","United States","🇺🇸","US","North America","Washington, D.C.","IAD"],["canada","Canada","🇨🇦","CA","North America","Ottawa","YOW"],["mexico","Mexico","🇲🇽","MX","North America","Mexico City","MEX"],["costa-rica","Costa Rica","🇨🇷","CR","North America","San José","SJO"],["panama","Panama","🇵🇦","PA","North America","Panama City","PTY"],["guatemala","Guatemala","🇬🇹","GT","North America","Guatemala City","GUA"],["dominican-republic","Dominican Republic","🇩🇴","DO","North America","Santo Domingo","SDQ"],["jamaica","Jamaica","🇯🇲","JM","North America","Kingston","KIN"],["el-salvador","El Salvador","🇸🇻","SV","North America","San Salvador","SAL"],["honduras","Honduras","🇭🇳","HN","North America","Tegucigalpa","TGU"],
  ["brazil","Brazil","🇧🇷","BR","South America","Brasília","BSB"],["argentina","Argentina","🇦🇷","AR","South America","Buenos Aires","EZE"],["chile","Chile","🇨🇱","CL","South America","Santiago","SCL"],["colombia","Colombia","🇨🇴","CO","South America","Bogotá","BOG"],["peru","Peru","🇵🇪","PE","South America","Lima","LIM"],["uruguay","Uruguay","🇺🇾","UY","South America","Montevideo","MVD"],["ecuador","Ecuador","🇪🇨","EC","South America","Quito","UIO"],["bolivia","Bolivia","🇧🇴","BO","South America","Sucre","VVI"],["paraguay","Paraguay","🇵🇾","PY","South America","Asunción","ASU"],["guyana","Guyana","🇬🇾","GY","South America","Georgetown","GEO"],
  ["australia","Australia","🇦🇺","AU","Oceania","Canberra","SYD"],["new-zealand","New Zealand","🇳🇿","NZ","Oceania","Wellington","WLG"],["fiji","Fiji","🇫🇯","FJ","Oceania","Suva","NAN"],["papua-new-guinea","Papua New Guinea","🇵🇬","PG","Oceania","Port Moresby","POM"],["tonga","Tonga","🇹🇴","TO","Oceania","Nukuʻalofa","TBU"],["nauru","Nauru","🇳🇷","NR","Oceania","Yaren","INU"],["samoa","Samoa","🇼🇸","WS","Oceania","Apia","APW"],["guam","Guam","🇬🇺","GU","Oceania","Hagåtña","GUM",true],["french-polynesia","French Polynesia","🇵🇫","PF","Oceania","Papeete","PPT",true],["northern-mariana-islands","Northern Mariana Islands","🇲🇵","MP","Oceania","Saipan","SPN",true],
];

export const countryPages = Object.fromEntries(destinations.map(([slug,name,flag,code,region,city,airport,territory=false]) => [slug, {
  name, flag, code, region, city, airport, territory,
  heroImage: images[region], heroWidth: 1200, heroHeight: 630, heroPosition: "center 50%", heroAlt: `Travel eSIM comparison guide for ${name}`,
  heroSummary: `Compare travel eSIM packages for ${name}. Review data, validity, published prices, connection technology and activation terms before purchase.`,

  networks: `Saily connects through local partner networks in ${name}; the specific carrier can vary by plan and location.`,
  coverage: "Saily states that speed may be 3G, 4G, LTE or 5G depending on the local provider, device and location.",
  plans: rotatePlanOrder(buildProviderPlanCatalog(name, slug), slug),
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
