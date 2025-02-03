import type { LoaderFunction } from "@remix-run/node";
import { imageUrlToBase64 } from "~/helpers/image";
import { getPlaceFromIata } from "~/helpers/sdk/place";

export const loader: LoaderFunction = async ({ request }) => {
  const googleStaticMapKey = process.env.GOOGLE_STATIC_MAP_KEY || "";
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const width = url.searchParams.get("w") || '300';
  const height = url.searchParams.get("h") || '200';

  if (!from || !to) {
    return new Response("Missing from or to in query parameter", {
      status: 400,
    });
  }

  try {
    const fromPlace = getPlaceFromIata(from.toUpperCase());
    const toPlace = getPlaceFromIata(to.toUpperCase());

    if (!fromPlace || !toPlace) {
      return new Response("Iata code was not found", {
        status: 400,
      });
    }

    //image map
    const urlMap = `https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff80|weight:5|${fromPlace.coordinates.latitude},${fromPlace.coordinates.longitude}|${toPlace.coordinates.latitude},${toPlace.coordinates.longitude}&size=${width}x${height}&maptype=roadmap&markers=color:blue%7Clabel:S%7C${fromPlace.coordinates.latitude},${fromPlace.coordinates.longitude}&markers=color:green%7Clabel:E%7C${toPlace.coordinates.latitude},${toPlace.coordinates.longitude}&key=${googleStaticMapKey}`;    
    const imgMapBase64 = await imageUrlToBase64(urlMap);
    const base64Data = imgMapBase64;

    // Decode the Base64 data (remove potential prefix like "data:image/png;base64,")
    const cleanBase64 = base64Data.includes(",")
      ? base64Data.split(",")[1]
      : base64Data;
    const imageBuffer = Buffer.from(cleanBase64, "base64");

    // Optionally detect the MIME type (default to "image/png")
    const mimeType = base64Data.startsWith("data:image/jpeg")
      ? "image/jpeg"
      : "image/png";

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable", // Optional caching
      },
    });
  } catch (error) {
    return new Response("Invalid Base64 data", { status: 400 });
  }
};
