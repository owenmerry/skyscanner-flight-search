import { useState } from 'react';
import type { FlightSDK } from '~/helpers/sdk/flight';

interface PricesProps {
  flight?: FlightSDK;
}

export const Prices = ({
  flight,
}: PricesProps): JSX.Element => {
  const [show, setShow] = useState(false);

  const handleToggle = () => {
    setShow(!show);
  };

  return (
    <div>
      <div className='panel-price'>
        <div>{flight?.price}</div>  
        <div><button className='button-stretch' onClick={handleToggle}>Select</button></div>  
      </div>
      {flight && show && (
        <>
        <h3>{flight.price}</h3>
        {flight?.prices.map((price, key) => (
          <div key={`${price.price}-${key}`}>
            {price.deepLinks.map((deepLink) => (
              <div key={deepLink.link} className="flight-price">
                <div>{price.price}</div>
                <img
                  width="100px"
                  src={deepLink.agentImageUrl}
                  alt={`${deepLink.agentName} logo`}
                />
                <a
                  target="_blank"
                  href={deepLink.link}
                  rel="noreferrer"
                >
                  View Deal
                </a>
                <div>({deepLink.agentName})</div>
              </div>
            ))}
          </div>
        ))}
        </>)}
      </div>);
};
