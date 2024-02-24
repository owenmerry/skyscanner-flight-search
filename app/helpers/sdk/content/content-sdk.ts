import type { SkyscannerAPIContentPageResponse } from "./content-response";

// SDK Types
export interface ContentSDK {
  page: SkyscannerAPIContentPageResponse | { error: string };
}

export const getContentSDK = async ({
  res,
  apiUrl,
  slug,
}: {
  res?: SkyscannerAPIContentPageResponse;
  slug?: string;
  apiUrl?: string;
}): Promise<ContentSDK> => {
  const page = res
    ? res
    : await getContent({
        apiUrl: apiUrl ? apiUrl : "",
        slug: slug ? slug : "",
      });

  return {
    page,
  };
};

export const getContent = async ({
  apiUrl,
  slug,
}: {
  apiUrl: string;
  slug: string;
}): Promise<SkyscannerAPIContentPageResponse | { error: string }> => {
  let content,
    error = "";
  if (!slug) return { error: "Slug is required" };
  try {
    const res = await fetch(`${apiUrl}/seo-pages/pages/${slug}`);
    const json: SkyscannerAPIContentPageResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      content = json;
    }
  } catch (ex) {}

  return content || { error };
};
