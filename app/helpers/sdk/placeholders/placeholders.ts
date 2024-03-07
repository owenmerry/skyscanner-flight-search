import { SkyscannerAPIContentPageResponse } from "../content/content-response";
import { getPlaceFromEntityId } from "../place";
import { placeholderExists } from "./placeholder-utils";

export const replacePlaceholders = (
  page: SkyscannerAPIContentPageResponse,
  {
    slug,
  }: {
    slug?: string;
  }
): SkyscannerAPIContentPageResponse => {
  const pageString = JSON.stringify(page);
  let pageUpdated = pageString;

  pageUpdated = replaceQuery(pageUpdated, slug);
  pageUpdated = replaceEntity(pageUpdated, slug);

  const pageParsed = JSON.parse(
    pageUpdated
  ) as SkyscannerAPIContentPageResponse;

  return pageParsed;
};

export const replaceQuery = (page: string, slug?: string): string => {
  if (!slug) return page;

  for (let num = 2; num < 10; num++) {
    page = page.replaceAll(`@@query${num}@@`, slug?.split("/")[num - 1] || "");
  }

  return page;
};

export const replaceEntity = (page: string, slug?: string): string => {
  if (!slug && !placeholderExists(page, ".entity.")) return page;

  for (let num = 2; num < 10; num++) {
    const query = slug?.split("/")[num - 1];
    if (!query) continue;
    const place = getPlaceFromEntityId(query);
    if (!place) continue;
    page = page.replaceAll(`@@query${num}.entity.name@@`, place.name || "");
    page = page.replaceAll(`@@query${num}.entity.iata@@`, place.iata || "");
  }

  return page;
};
