export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://travelesim.global";

export function sitePath(path = "/") {
  return `${basePath}${path}` || "/";
}

export function siteUrl(path = "/") {
  return `${siteOrigin}${path}`;
}
