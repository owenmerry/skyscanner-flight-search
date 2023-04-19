import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HeaderDefault } from '~/components/ui/header/header-default';
import { HeroDefault } from '~/components/ui/hero/hero-default';
import { NavigationWebsite } from '~/components/ui/navigation/navigation-website';
import { FooterDefault } from '~/components/ui/footer/footer-default';

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';

  return {
    apiUrl,
    stat: true,
  }

};

export default function Index() {
  const { apiUrl, params, fromText, toText, fromIata, toIata, fromEnityId, toEnityId } = useLoaderData();

  return (
    <div>
      <HeaderDefault />
      <HeroDefault apiUrl={apiUrl} />
      <NavigationWebsite />
      <FooterDefault />
    </div>
  );
}
