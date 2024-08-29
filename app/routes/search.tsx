import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";

export const loader = async ({ params }: LoaderArgs) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  return {
    apiUrl,
  };
};

export default function SearchFlight() {
  const { pathname } = useLocation();
  const {
    apiUrl,
  }: {
    apiUrl: string;
  } = useLoaderData();

  return (
    <div>
      <Layout selectedUrl="/search" apiUrl={apiUrl}>
        <Outlet key={`outlet-${pathname}`} />
      </Layout>
    </div>
  );
}
