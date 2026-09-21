export const dynamic = "force-static";

// The site is closed to crawlers. No sitemap or host line is published while
// this is in force, because pointing crawlers at a sitemap they may not fetch
// only sends mixed signals.
//
// Cloudflare's managed robots.txt is prepended to this file and carries its own
// `User-agent: *` group with `Allow: /`. Robots.txt groups for the same agent
// merge, and an equally specific allow beats a disallow, so the managed block
// has to stay switched off for this rule to hold.
export default function robots() {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
