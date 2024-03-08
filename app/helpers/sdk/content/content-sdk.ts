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
}: {
  resPage?: SkyscannerAPIContentPageResponse;
  resPages?: SkyscannerAPIContentPagesResponse;
  slug?: string;
  apiUrl?: string;
}): Promise<ContentSDK> => {
  const page = resPage
    ? resPage
    : await getPage({
        apiUrl: apiUrl ? apiUrl : "",
        slug: slug ? slug : "",
      });
  const pages = resPages
    ? resPages
    : await getPages({
        apiUrl: apiUrl ? apiUrl : "",
      });

  return {
    page,
    pages,
  };
};

export const getPage = async ({
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
    const res = await fetch(`${apiUrl}/content/pages/${slug}`);
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
}: {
  apiUrl: string;
}): Promise<SkyscannerAPIContentPagesResponse | { error: string }> => {
  let content,
    error = "";
  try {
    const res = await fetch(`${apiUrl}/content/pages/`);
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
