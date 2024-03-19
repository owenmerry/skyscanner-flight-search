import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { json } from "@remix-run/node";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import {
  Place,
  getIataFromEntityId,
  getPlaceFromIata,
} from "~/helpers/sdk/place";
import { SearchSDK } from "~/helpers/sdk/flight/flight-functions";

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  const backgroundImage = await getImages({
    apiUrl,
    query: "woods",
  });

  const from = getPlaceFromIata("LON");
  const to = getPlaceFromIata("DUB");

  if (!from || !to) return;

  const data = await skyscanner().flight().poll({
    apiUrl,
    token:
      "CnRDbFFJQVJKUUNrNEtKREkzWW1ObE0yVTBMVEZsTm1NdE5ERTNNQzFoWVdWa0xXTTRZVGs1T0RVM05URTJPUkFDR2lRNFpXSmpPRGM1Tmkwek56VTJMVFF5TURjdFltRmtZaTFpTjJVNE5EVmxNREEwWXpFPSI3CgJVSxIFZW4tR0IaA0dCUCIhCgoSCDI3NTQ0MDA4EgoSCDI3NTQwODIzGgcI6A8QBRgBKAEwASokMjdiY2UzZTQtMWU2Yy00MTcwLWFhZWQtYzhhOTk4NTc1MTY5-cells2",
  });

  return json({
    apiUrl,
    backgroundImage,
    data,
    from,
    to,
  });
};

export default function Index() {
  const { backgroundImage, data, from, to } = useLoaderData<{
    backgroundImage: string[];
    data: SearchSDK;
    from: Place;
    to: Place;
  }>();
  const randomHeroImage = backgroundImage[1];

  console.log(data);

  return (
    <Layout>
      <HeroSimple
        title={"Page Not Found"}
        text="We cant find the page you are looking for, maybe try a different link"
        backgroundImage={randomHeroImage}
      />
      <div>
        {data.best.map((flight) => (
          <div>
            {from.name} Flight for {flight.price}
          </div>
        ))}
      </div>
    </Layout>
  );
}
