import type { LoaderFunction } from '@remix-run/node';
import { HeaderDefault } from '~/components/ui/header/header-default';
import { HeroDefault } from '~/components/ui/hero/hero-default';
import { NavigationWebsite } from '~/components/ui/navigation/navigation-website';
import { FooterDefault } from '~/components/ui/footer/footer-default';

export const loader: LoaderFunction = async ({ request, context, params }) => {

  return {
    stat: true,
  }

};

export default function Index() {

  return (
    <div>
      <HeaderDefault />
      <HeroDefault />
      <NavigationWebsite />
      <FooterDefault />
    </div>
  );
}
