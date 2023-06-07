import { Outlet, useLocation } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";

export default function SearchFlight() {
  const { pathname } = useLocation();

  return (
    <div>
      <Layout selectedUrl="/search-flight">
        <Outlet key={`outlet-${pathname}`} />
      </Layout>
    </div>
  );
}
