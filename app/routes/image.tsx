import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const base64Data = url.searchParams.get('data');

  if (!base64Data) {
    return new Response('Missing "data" query parameter', { status: 400 });
  }

  try {
    // Decode the Base64 data (remove potential prefix like "data:image/png;base64,")
    const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    const imageBuffer = Buffer.from(cleanBase64, 'base64');

    // Optionally detect the MIME type (default to "image/png")
    const mimeType = base64Data.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable', // Optional caching
      },
    });
  } catch (error) {
    return new Response('Invalid Base64 data', { status: 400 });
  }
};