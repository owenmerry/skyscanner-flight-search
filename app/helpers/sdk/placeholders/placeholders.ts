import moment from "moment";
import { SkyscannerAPIContentPageResponse } from "../content/content-response";
import {
  getPlaceFromEntityId,
  getPlaceFromIata,
  getPlaceFromSlug,
} from "../place";
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

  for (let num = 0; num < 5; num++) {
    pageUpdated = replaceQuery(pageUpdated, slug);
    pageUpdated = replaceEntity(pageUpdated, slug);
    pageUpdated = replaceDate(pageUpdated, slug);
  }

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
    let place = getPlaceFromEntityId(query);
    if (!place) place = getPlaceFromIata(query);
    if (!place) place = getPlaceFromSlug(query, "PLACE_TYPE_COUNTRY");
    if (!place) place = getPlaceFromSlug(query, "PLACE_TYPE_CITY");
    if (!place) place = getPlaceFromSlug(query, "PLACE_TYPE_AIRPORT");
    if (!place) continue;
    page = page.replaceAll(`@@query${num}.entity.id@@`, place.entityId || "");
    page = page.replaceAll(`@@query${num}.entity.name@@`, place.name || "");
    page = page.replaceAll(`@@query${num}.entity.iata@@`, place.iata || "");
    page = page.replaceAll(
      `@@query${num}.entity.image@@`,
      place.images[0] || ""
    );
    page = page.replaceAll(
      `@@query${num}.entity.parentId@@`,
      place.parentId || ""
    );
    page = page.replaceAll(`@@query${num}.entity.type@@`, place.type || "");
    page = page.replaceAll(
      `@@query${num}.entity.coordinates.latitude@@`,
      String(place.coordinates.latitude) || ""
    );
    page = page.replaceAll(
      `@@query${num}.entity.coordinates.longitude@@`,
      String(place.coordinates.longitude) || ""
    );
  }

  return page;
};

export const replaceDate = (page: string, slug?: string): string => {
  if (!slug && !placeholderExists(page, "@@date.")) return page;

  //month static
  for (let num = 1; num < 13; num++) {
    const date = moment(`${moment().format("YYYY")}/${num}/1`);
    page = page.replaceAll(
      `@@date.static.month.${num}.number@@`,
      date.format("M") || ""
    );
    page = page.replaceAll(
      `@@date.static.month.${num}.numberLong@@`,
      date.format("MM") || ""
    );
    page = page.replaceAll(
      `@@date.static.month.${num}.name@@`,
      date.format("MMMM") || ""
    );
    page = page.replaceAll(
      `@@date.static.month.${num}.nameLower@@`,
      date.format("MMMM").toLowerCase() || ""
    );
    page = page.replaceAll(
      `@@date.static.month.${num}.nameShort@@`,
      date.format("MMM") || ""
    );
  }

  //month
  for (let num = 0; num < 12; num++) {
    const nextMonth = num === 0 ? `` : `${num}.`;
    page = page.replaceAll(
      `@@date.month.${nextMonth}.number@@`,
      moment().add(num, "months").format("M") || ""
    );
    page = page.replaceAll(
      `@@date.month.${nextMonth}.numberLong@@`,
      moment().add(num, "months").format("MM") || ""
    );
    page = page.replaceAll(
      `@@date.month.${nextMonth}.name@@`,
      moment().add(num, "months").format("MMMM") || ""
    );
    page = page.replaceAll(
      `@@date.month.${nextMonth}.nameLower@@`,
      moment().add(num, "months").format("MMMM").toLowerCase() || ""
    );
    page = page.replaceAll(
      `@@date.month.${nextMonth}.nameShort@@`,
      moment().add(num, "months").format("MMM") || ""
    );
  }

  //day
  page = page.replaceAll(`@@date.day.number@@`, moment().format("D") || "");
  page = page.replaceAll(
    `@@date.day.numberLong@@`,
    moment().format("DD") || ""
  );
  page = page.replaceAll(
    `@@date.day.numberDescription@@`,
    moment().format("Do") || ""
  );

  //year
  page = page.replaceAll(`@@date.year.number`, moment().format("YYYY") || "");

  return page;
};
