import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const googleStaticMapKey = process.env.GOOGLE_STATIC_MAP_KEY || "";
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response("Missing from or to in query parameter", {
      status: 400,
    });
  }

  try {

    const image = await fetch(`https://places.googleapis.com/v1/${id}/media?key=${googleStaticMapKey}&maxWidthPx=500&skipHttpRedirect=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const imageData = await image.json();

    return new Response(imageData, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60, immutable", // Optional caching
      },
    });
  } catch (error) {
    return new Response("Invalid Base64 data", { status: 400 });
  }
};
