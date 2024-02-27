import { ContentfulField } from "~/helpers/sdk/content/content-response";

export const getStringOrDefault = (
  value: ContentfulField,
  defaultValue?: string
): string => {
  return typeof value === "string" ? value : defaultValue || "";
};

export const getBooleanOrDefault = (
  value: ContentfulField,
  defaultValue?: boolean
): boolean => {
  return typeof value === "boolean" ? value : defaultValue || true;
};
