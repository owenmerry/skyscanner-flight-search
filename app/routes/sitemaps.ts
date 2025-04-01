import type { LoaderArgs } from "@remix-run/node";
import moment from "moment";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

export let loader = async ({ request }: LoaderArgs) => {
  // Base URL of your site
  const baseUrl = new URL(request.url).origin;

  const continents = skyscanner().geo().continent;
  const countries = skyscanner().geo().countries;
  const cities = skyscanner().geo().cities;
  const dateUpdated = moment().format("YYYY-MM-DD");

  // Generate XML content
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
      <loc>${baseUrl}/</loc>
      <lastmod>${new Date(dateUpdated).toISOString()}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>1.0</priority>
    </url>
     <url>
      <loc>${baseUrl}/explore</loc>
      <lastmod>${new Date(dateUpdated).toISOString()}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>1.0</priority>
    </url>
      ${continents
        .map((continent) => {
          return `
          <url>
            <loc>${baseUrl}/continent/${continent.slug}</loc>
            <lastmod>${new Date(dateUpdated).toISOString()}</lastmod>
            <changefreq>hourly</changefreq>
            <priority>0.9</priority>
          </url>
        `;
        })
        .join("")}
      ${countries
        .map((country) => {
          return `
          <url>
            <loc>${baseUrl}/country/${country.slug}</loc>
            <lastmod>${new Date(dateUpdated).toISOString()}</lastmod>
            <changefreq>hourly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
        })
        .join("")}
      ${cities
        .map((city) => {
          return `
          <url>
            <loc>${baseUrl}/city/${city.country.slug}/${city.slug}</loc>
            <lastmod>${new Date(dateUpdated).toISOString()}</lastmod>
            <changefreq>hourly</changefreq>
            <priority>0.5</priority>
          </url>
        `;
        })
        .join("")}
    </urlset>
  `;

  // Return XML response
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
