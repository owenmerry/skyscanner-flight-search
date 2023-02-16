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
        <div><button className='button-stretch' onClick={handleToggle}>See Prices from {flight?.price} ({flight?.prices.length} deal{flight && flight?.prices.length > 1 ? 's' : ''})</button></div>  
      </div>
      {flight && show && (
        <>
        {flight?.prices.map((price, key) => (
          <div key={`${price.price}-${key}`}>
            {price.deepLinks.map((deepLink) => (
              <div key={deepLink.link} className="flight-price">
                <div className="image">
                  {deepLink.agentImageUrl !== "" &&
                    <img
                      height="30px"
                      src={deepLink.agentImageUrl}
                      alt={`${deepLink.agentName} logo`}
                    />
                  }
                </div>
                <div>{deepLink.agentName}</div>
                 <div>{price.price}</div>
                <a
                  target="_blank"
                  href={deepLink.link}
                  rel="noreferrer"
                  className='button'
                >
                  View Deal
                </a>
              </div>
            ))}
          </div>
        ))}
        </>)}
      </div>);
};
