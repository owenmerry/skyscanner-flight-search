import https from 'https';

export const getImage = async (entityId: string): Promise<string> => {
  const res = await fetch(
    `http://postcard.skyscanner.io/api/v1/traveller-destination/${entityId}?&w=300&h=300&resize=crop&q=90`
  );
  const json = await res.json();
  const image = json.results[entityId].url;

  return image;
};

export const imageUrlToBase64 = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const imageData = Buffer.concat(chunks);
        const base64 = imageData.toString('base64');
        const mimeType = response.headers['content-type'];
        resolve(`data:${mimeType};base64,${base64}`);
      });
    }).on('error', (err) => {
      reject(new Error(`Failed to fetch image: ${err.message}`));
    });
  });
}
