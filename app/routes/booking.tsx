import { Outlet, useLocation } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";

export default function FlightDetails() {
  const { pathname } = useLocation();

  return (
    <div>
      <Layout selectedUrl="/search">
        <Outlet key={`outlet-${pathname}`} />
      </Layout>
    </div>
  );
}
