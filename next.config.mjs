const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "esimglobal.travel";
const basePath = isGitHubPages ? `/${repositoryName}` : "";
const repositoryOwner = process.env.GITHUB_REPOSITORY?.split("/")[0] || "koraytugberkgubur";
const siteOrigin = isGitHubPages ? `https://${repositoryOwner.toLowerCase()}.github.io${basePath}` : "https://esimglobal.travel";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_ORIGIN: siteOrigin,
  },
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
