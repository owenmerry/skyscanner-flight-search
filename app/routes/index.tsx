
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
    <div className='banner'>
    </div>
    <div className='wrapper'>
      <div className='panels'>
        <div className='panel'>
          <h2>Flight Search</h2>
          <p>Search for flights around the world.</p>
          <Link className='button' to="/search">Search Flights</Link>
        </div>
        <div className='panel'>
          <h2>Weekend Flight Search</h2>
          <p>Search for your next weekend away trip.</p>
          <Link className='button' to='/weekend'>Search Weekend Flights</Link>
        </div>
        <div className='panel'>
          <h2>Week Flight Search</h2>
          <p>Search for your week away.</p>
          <Link className='button' to='/week'>Search Week Flights</Link>
        </div>
        <div className='panel'>
          <h2>Year Flight Search</h2>
          <p>Search a route for a year</p>
          <Link className='button' to='/year'>Year Flight Search</Link>
        </div>
        <div className='panel'>
          <h2>SEO</h2>
          <p>Search location to location anytime</p>
          <Link className='button' to='/seo'>SEO Search</Link>
        </div>
      </div>
    </div>
  </div>);
}
