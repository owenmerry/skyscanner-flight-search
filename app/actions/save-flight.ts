import { json } from "@remix-run/node";
import { userPrefs } from "~/helpers/cookies";

export async function actionsSaveFlight({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const formData = await request.formData();
  const liked = formData.get("liked");

  cookie.liked = Number(cookie.liked) + Number(liked);

  //if (saveFlight) {
    
    return json({ liked: cookie.liked }, {
      headers: {
        "Set-Cookie": await userPrefs.serialize(cookie),
      }
    });
  //}
}
