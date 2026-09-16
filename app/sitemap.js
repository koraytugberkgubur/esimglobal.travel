import { countryPages, countrySlugs } from "./countryPages";
import { siteUrl } from "./sitePath";

export const dynamic = "force-static";

const lastModified = "2026-09-17T00:00:00+03:00";

const editorialRoutes = [
  "airalo-alternatives",
  "best-travel-esim",
  "esim-glossary",
  "how-to-choose-a-travel-esim",
  "saily-review",
  "saily-vs-airalo",
  "saily-vs-holafly",
  "travel-esim-statistics",
  "what-is-a-travel-esim",
];

export default function sitemap() {
  const countryRoutes = [
    { route: "france", image: "/images/france-esim-hero.jpg" },
    ...countrySlugs.map((route) => ({
      route,
      image: countryPages[route].heroImage,
    })),
  ];

  return [
    {
      url: siteUrl("/"),
      lastModified,
    },
    ...countryRoutes.map(({ route, image }) => ({
      url: siteUrl(`/${route}/`),
      lastModified,
      ...(image ? { images: [siteUrl(image)] } : {}),
    })),
    ...editorialRoutes.map((route) => ({
      url: siteUrl(`/${route}/`),
      lastModified,
    })),
  ];
}
