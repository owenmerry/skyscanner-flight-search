import React, { useState } from 'react';
import type { FlightSDK } from '~/helpers/sdk/skyscannerSDK';
import type { FlightQuery, FlightUrl } from '~/types/search';

interface PricesProps {
  flight?: FlightSDK;
  query?: FlightQuery;
  url?: FlightUrl;
  open?: boolean;
  showButton?: boolean;
}

export const Prices = ({
  flight,
  query,
  url,
  open = false,
  showButton = true,
}: PricesProps): JSX.Element => {
  const [show, setShow] = useState(open);

  const departDateSkyscannerUrlFormat = `${query?.depart.split('-')[0].slice(2)}${query?.depart.split('-')[1]}${query?.depart.split('-')[2]}`;
  const returnDateSkyscannerUrlFormat = query?.return && `${query?.return.split('-')[0].slice(2)}${query?.return.split('-')[1]}${query?.return.split('-')[2]}` || null;

  const handleToggle = () => {
    setShow(!show);
  };

  return (
    <div>
      <div className='panel-price'>
        {showButton && (
          <div><button className='button-stretch' onClick={handleToggle}>See Prices from <b>{flight?.price}</b> ({flight?.prices.length} deal{flight && flight?.prices.length > 1 ? 's' : ''})</button></div>
        )}
      </div>
      {flight && show && (
        <>
          {flight?.prices.map((price, key) => (
            <div key={`${price.price}-${key}`}>
              <div className="flight-price">
                {price.deepLinks.map((deepLink) => (
                  <React.Fragment key={deepLink.link}>
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
                    <div><b>{price.price}</b></div>
                    <a
                      target="_blank"
                      href={deepLink.link}
                      rel="noreferrer"
                    >
                      View Deal
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          <div className="">
            <a
              target="_blank"
              href={`https://www.skyscanner.net/transport/flights/${url?.from}/${url?.to}/${departDateSkyscannerUrlFormat}${returnDateSkyscannerUrlFormat ? `/${returnDateSkyscannerUrlFormat}` : ''}/config/${encodeURIComponent(flight.itineraryId)}`}
              rel="noreferrer"
            >See on Skyscanner</a>
          </div>
        </>)}
    </div>);
};
