import { destinationRegistry, destinationByCode } from "./countryRegistry.js";
import { countryCoordinates } from "./countryCoordinates.js";

// Editorial selections, not traffic or popularity rankings. Keep the footer
// small; the sitemap and country navigation cover the full destination list.
const featuredCodes = ["FR", "JP", "ZA", "US", "BR", "AU"];
const nearbySelections = {
  FR: ["DE", "IT", "ES", "BE", "CH", "GB"],
  DE: ["FR", "AT", "CH", "NL", "BE", "PL"],
  IT: ["FR", "CH", "AT", "SI", "HR", "MT"],
  ES: ["PT", "FR", "AD", "MA", "IT", "GB"],
  GB: ["IE", "FR", "BE", "NL", "DE", "DK"],
  TR: ["GR", "BG", "GE", "AM", "AZ", "CY"],
  JP: ["KR", "TW", "CN", "PH", "VN", "TH"],
  ZA: ["NA", "BW", "MZ", "ZW", "LS", "SZ"],
  US: ["CA", "MX", "BS", "CU", "JM", "CR"],
  BR: ["AR", "UY", "PY", "BO", "PE", "CO"],
  AU: ["NZ", "ID", "PG", "FJ", "VU", "SB"],
};

function distanceBetween(first, second) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const [latitudeA, longitudeA] = first.map(radians);
  const [latitudeB, longitudeB] = second.map(radians);
  const arc = Math.sin((latitudeB - latitudeA) / 2) ** 2
    + Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin((longitudeB - longitudeA) / 2) ** 2;
  return 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, arc))));
}

export function getFooterDestinations(country) {
  const current = destinationRegistry.find((destination) => destination.name === country);
  if (!current) return featuredCodes.map((code) => destinationByCode[code]);

  if (nearbySelections[current.code]) {
    return nearbySelections[current.code].map((code) => destinationByCode[code]);
  }

  // Include nearby destinations across continent boundaries and the date line.
  // The positions guide link selection; they do not imply a shared land border.
  const origin = countryCoordinates[current.code];
  return destinationRegistry
    .filter((destination) => destination.code !== current.code)
    .map((destination) => ({ destination, distance: distanceBetween(origin, countryCoordinates[destination.code]) }))
    .sort((a, b) => a.distance - b.distance || a.destination.code.localeCompare(b.destination.code))
    .slice(0, 6)
    .map(({ destination }) => destination);
}
