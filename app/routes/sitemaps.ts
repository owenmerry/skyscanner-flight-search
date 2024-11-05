import type { LoaderArgs } from "@remix-run/node";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

export let loader = async ({ request } : LoaderArgs) => {
  // Base URL of your site
  const baseUrl = new URL(request.url).origin;

  const countries = skyscanner().geo().countries;

  // Generate XML content
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${countries
        .map(country => {
          return `
          <url>
            <loc>${baseUrl}/country/${country.slug}</loc>
            <lastmod>${new Date('2024-10-05').toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
        })
        .join('')}
    </urlset>
  `;

  // Return XML response
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};