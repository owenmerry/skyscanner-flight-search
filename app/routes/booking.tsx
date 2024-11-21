import { ActionArgs } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import { actionsSearchForm } from "~/actions/search-form";
import { Layout } from "~/components/ui/layout/layout";

export async function action({ request }: ActionArgs) {
  let action;
  action = actionsSearchForm({ request });

  return action;
}

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
