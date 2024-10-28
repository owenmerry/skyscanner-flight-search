import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import type { LoaderFunction } from "@remix-run/node";
import { HeroFlight } from "~/components/section/hero/hero-flight";
import { getImages } from "~/helpers/sdk/query";

export const loader: LoaderFunction = async () => {
  return {};
};

export default function SearchFlight() {
  return (
    <div>
      <Layout selectedUrl="/search">
        <div>Maintenance Mode</div>
      </Layout>
    </div>
  );
}
