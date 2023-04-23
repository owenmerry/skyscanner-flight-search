import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData, Outlet } from '@remix-run/react';
import { HeaderDefault } from '~/components/ui/header/header-default';
import { HeroDefault } from '~/components/ui/hero/hero-default';

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';

  return {
    apiUrl,
  }

};

export default function SearchFlight() {
  const { apiUrl } = useLoaderData();


  return (
    <div>
      <HeaderDefault selectedUrl='/search-flight' />
      <HeroDefault apiUrl={apiUrl} showText={false} />
      <Outlet />
    </div>
  );
}
