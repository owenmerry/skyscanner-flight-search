
import { Link } from '@remix-run/react';

export default function Index() {
  
  return (<div>
    <div><Link to="/search">Search flights</Link></div>
    <div><Link to='/weekend'>Weekend flights</Link></div>
  </div>);
}
