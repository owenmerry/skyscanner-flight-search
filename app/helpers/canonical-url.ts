type GenerateCanonicalUrlArgs = {
    origin: string;
    path: string;
    queryParams: Record<string, string>;
    allowedParams?: string[];
  };
  
export const generateCanonicalUrl = ({ origin, path, queryParams, allowedParams = [] }: GenerateCanonicalUrlArgs): string => {
  // Ensure the path always removes a trailing '/'
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;

  // Construct the base URL from origin and normalized path
  const baseUrl = `${origin.replace('http://', 'https://')}${normalizedPath}`.toLowerCase();

  // Build the query string based on the allowed parameter order
  const allowedQuery = allowedParams
    .filter((key) => key in queryParams) // Only include keys present in queryParams
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`) // Encode key-value pairs
    .join("&"); // Join the pairs with '&'

  // Append query string if there are allowed parameters
  const fullUrl = allowedQuery ? `${baseUrl}?${allowedQuery}` : baseUrl;

  return fullUrl.toLowerCase();
  }