
import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import globalStyles from '~/styles/global.css';
import flightStyles from '~/styles/flight.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: flightStyles },
  ];
}

export default function Index() {
  
  return (<div>
    <div><Link to="/search">Search flights</Link></div>
    <div><Link to='/weekend'>Weekend flights</Link></div>
  </div>);
}
