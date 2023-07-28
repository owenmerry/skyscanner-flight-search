import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import type { Place } from "~/helpers/sdk/place";
import { getAirportWithCountries } from "~/helpers/sdk/data";

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  //const airports = getAirportWithCountries();
  const airports: Place[] = [];

  return {
    airports,
  };
};

export default function Index() {
  const { airports }: { airports: Place[] } = useLoaderData();

  return <Layout selectedUrl="/">Run Fuctions</Layout>;
}
