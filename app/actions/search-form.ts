import { redirect } from "@remix-run/node";
import { userPrefs } from "~/helpers/cookies";
import type { Place } from "~/helpers/sdk/place";

export async function actionsSearchForm({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();
  const searchType = bodyParams.get("search");
  const from = bodyParams.get("from") ? bodyParams.get("from") : "";
  const fromParse: Place | undefined =
    typeof from === "string" ? JSON.parse(from) : undefined;

  if (from) {
    cookie.from = from;
  }

  const query = {
    from: fromParse?.iata || "",
    to: bodyParams.get("to"),
    depart: bodyParams.get("depart"),
    return: bodyParams.get("return"),
  };

  if (searchType === "explore") {
    return redirect(`/search/${query.from}`, {
      headers: {
        "Set-Cookie": await userPrefs.serialize(cookie),
      },
    });
  }
}