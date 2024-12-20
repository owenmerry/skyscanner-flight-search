import type {
  SkyscannerAPIContentPageResponse,
  SkyscannerAPIContentPagesResponse,
} from "./content-response";

// SDK Types
export interface ContentSDK {
  page: SkyscannerAPIContentPageResponse | { error: string };
  pages: SkyscannerAPIContentPagesResponse | { error: string };
}

export const getContentSDK = async ({
  resPage,
  resPages,
  apiUrl,
  slug,
  preview = false,
}: {
  resPage?: SkyscannerAPIContentPageResponse;
  resPages?: SkyscannerAPIContentPagesResponse;
  slug?: string;
  apiUrl?: string;
  preview?: boolean;
}): Promise<ContentSDK> => {
  const page = resPage
    ? resPage
    : await getPage({
        apiUrl: apiUrl ? apiUrl : "",
        slug: slug ? slug : "",
        preview,
      });
  const pages = resPages
    ? resPages
    : await getPages({
        apiUrl: apiUrl ? apiUrl : "",
        preview,
      });

  return {
    page,
    pages,
  };
};

export const getPage = async ({
  apiUrl,
  slug,
  preview = false,
}: {
  apiUrl: string;
  slug: string;
  preview?: boolean;
}): Promise<SkyscannerAPIContentPageResponse | { error: string }> => {
  let content,
    error = "";
  if (!slug) return { error: "Slug is required" };
  try {
    console.log(`${apiUrl}/content/pages/${slug}${preview ? `?preview=true` : ""}`);
    const res = await fetch(`${apiUrl}/content/pages/${slug}${preview ? `?preview=true` : ""}`);
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

export const getPages = async ({
  apiUrl,
  preview = false,
}: {
  apiUrl: string;
  preview?: boolean;
}): Promise<SkyscannerAPIContentPagesResponse | { error: string }> => {
  let content,
  error = "";
  try {
    console.log(`${apiUrl}/content/pages/${preview ? `?preview=true` : ""}`);
    const res = await fetch(
      `${apiUrl}/content/pages/${preview ? `?preview=true` : ""}`
    );
    const json: SkyscannerAPIContentPagesResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      content = json;
    }
  } catch (ex) {}

  return content || { error };
};
