import { hasCurrentPrice, primaryPlan, PRICE_MAX_AGE_DAYS } from "./pricePolicy";
import { siteUrl } from "./sitePath";
import { buildCountryFaqGroups } from "./countryFaqData";

export default function CountryStructuredData({ slug, name, description, image, imageAlt, plans, networks, coverage }) {
  const pageUrl = siteUrl(`/${slug}/`);
  const webpageId = `${pageUrl}#webpage`;
  const imageId = `${pageUrl}#primaryimage`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const planListId = `${pageUrl}#plans-list`;
  const faqId = `${pageUrl}#faq`;
  const faqGroups = buildCountryFaqGroups({ country: name, bestPlan: primaryPlan(plans), networks, coverage, plans });

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: pageUrl,
        name: `Best eSIM for ${name}: Compare Plans & Prices`,
        description,
        inLanguage: "en",
        dateModified: plans.map(plan=>plan.checkedAt).filter(Boolean).sort().at(-1),
        isPartOf: { "@id": `${siteUrl("/")}#website` },
        publisher: { "@id": `${siteUrl("/")}#organization` },
        primaryImageOfPage: { "@id": imageId },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: [{ "@id": planListId }, { "@id": faqId }],
        about: {
          "@type": "Thing",
          name: `${name} travel eSIM plans`,
        },
      },
      {
        "@type": "ImageObject",
        "@id": imageId,
        url: siteUrl(image),
        contentUrl: siteUrl(image),
        width: 1200,
        height: 630,
        caption: imageAlt,
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Global eSIMs",
            item: siteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: `${name} eSIMs`,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": planListId,
        name: `eSIM plans compared for ${name}`,
        numberOfItems: plans.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: plans.map((plan, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: `${plan.brand} ${plan.product} eSIM plan`,
            serviceType: "Prepaid travel eSIM plan",
            provider: {
              "@type": "Organization",
              name: plan.brand,
            },
            areaServed: {
              "@type": "Country",
              name,
            },
            description: `${plan.dataLabel}; validity ${plan.daysLabel || `${plan.days} days`}; ${plan.network}.`,
            ...(hasCurrentPrice(plan) ? { offers: {
              "@type": "Offer",
              price: plan.price.toFixed(2),
              priceCurrency: plan.currency,
              priceValidUntil: new Date(Date.parse(plan.checkedAt)+PRICE_MAX_AGE_DAYS*86400000).toISOString().slice(0,10),
              url: plan.url || `${pageUrl}#plans`,
            } } : {}),
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        mainEntity: faqGroups.flatMap((group) => group.questions).map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
