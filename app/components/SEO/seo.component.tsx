import { useState, useEffect, useCallback } from 'react';
import { formatDistance, format } from 'date-fns';
import { getPrice } from '~/helpers/sdk/price';
import { Link } from '@remix-run/react';
import { convertDateToYYYMMDDFormat } from '~/helpers/date';
import { Map } from '~/components/map';
import { Wrapper } from "@googlemaps/react-wrapper";
import type { SkyscannerAPIIndicitiveResponse, IndicitiveQuote } from '~/types/geo';
import { getSEODateDetails } from '~/helpers/date';

interface SEOProps {
  apiUrl: string;
  googleApiKey: string;
  query: {
    from: string;
    month: string;
    endMonth?: number;
    to?: string;
    groupType?: string;
  };
  showItems?: boolean;
  showMap?: boolean;
  fromLocation: {
    entityId: string;
    parentId: string;
    name: string;
    type: string;
    iata: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export const SEO = ({
  apiUrl,
  googleApiKey,
  query,
  showMap = true,
  showItems = true,
  fromLocation,
}: SEOProps): JSX.Element => {
  const [search, setSearch] = useState<SkyscannerAPIIndicitiveResponse>();
  const [filter, setFilter] = useState<number | undefined>();

  const handleSearch = useCallback(async () => {
    try {
      const res = await fetch(
        `${apiUrl}/price?from=${query.from}&month=${query.month}&groupType=month`);
      const json: SkyscannerAPIIndicitiveResponse = await res.json();

      if (json) {
        setSearch(json);
      }
    } catch (ex) {
    }
  }, [apiUrl]);


  useEffect(() => {
    handleSearch();
  }, []);

  const sortByPrice = (quoteGroups: IndicitiveQuote[]) => {
    const sorted = quoteGroups.sort(function (a, b) {
      const quoteA: any = search?.content.results.quotes[a.quoteIds[0]];
      const quoteB: any = search?.content.results.quotes[b.quoteIds[0]];

      return quoteA.minPrice.amount - quoteB.minPrice.amount;
    });

    return sorted;
  }

  const filterItems = (quoteGroups: IndicitiveQuote[]) => {
    return quoteGroups.filter((quoteGroup) => {
      const quote: any = search?.content.results.quotes[quoteGroup.quoteIds[0]];
      if (!filter) return true;

      return quote.minPrice.amount <= filter;
    });
  }
  const filterNonCordItems = (quoteGroups: IndicitiveQuote[]) => {
    return quoteGroups.filter((quoteGroup) => {
      if (!search) return null;
      const {
        placeOutboundDestination,
      } = getSEODateDetails(search.content.results, quoteGroup.quoteIds[0]);

      return !!placeOutboundDestination.coordinates;
    });
  }

  const getMarkers = (search?: SkyscannerAPIIndicitiveResponse): {
    location: google.maps.LatLngLiteral;
    label: string;
  }[] | null => {
    if (!search) return null;
    const markers = filterItems(filterNonCordItems(search.content.groupingOptions.byRoute.quotesGroups)).map((quoteKey) => {
      const {
        quote,
        placeOutboundDestination,
        dateOutboundFlight,
        dateInboundFlight,
        tripDays,
        placeOutboundOrigin
      } = getSEODateDetails(search.content.results, quoteKey.quoteIds[0]);

      return {
        location: {
          lat: placeOutboundDestination.coordinates.latitude,
          lng: placeOutboundDestination.coordinates.longitude,
        },
        label: `${placeOutboundDestination.name} for ${getPrice(quote.minPrice.amount, quote.minPrice.unit)} and <b>${tripDays}</b> long, ${format(dateOutboundFlight, 'EEE, dd MMM')} to ${format(dateInboundFlight, 'EEE, dd MMM')} <a href='${`/search-flight/${placeOutboundOrigin?.iata}/${placeOutboundDestination?.iata}/${convertDateToYYYMMDDFormat(dateOutboundFlight)}/${format(dateInboundFlight, 'yyyy-MM-dd')}`}'>See deal</a>`,
      }
    });
    return markers;
  }

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(Number(e.target.value));
  }


  return (
    <>
      {!search ? '' : (<>
        {showMap ? (
          <div className='dark:text-black'>
            <Wrapper apiKey={googleApiKey}>
              <Map center={fromLocation.coordinates ? { lat: fromLocation.coordinates.latitude, lng: fromLocation.coordinates.longitude } : { lat: 0, lng: 0 }} zoom={5} markers={getMarkers()} />
            </Wrapper>
          </div>
        ) : ''}
        <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
          <div className='mb-2'>Filter by Buget: <input className='dark:bg-gray-800' type='number' value={filter || ''} onChange={handleFilter} /></div>
          {showItems ? (
            <>
              {sortByPrice(filterItems(search.content.groupingOptions.byRoute.quotesGroups)).map((quoteKey) => {
                const quote = search.content.results.quotes[quoteKey.quoteIds[0]];
                const placeInboundOrigin = search.content.results.places[quote.inboundLeg.originPlaceId];
                const placeInboundDestination = search.content.results.places[quote.inboundLeg.destinationPlaceId];
                const placeOutboundOrigin = search.content.results.places[quote.outboundLeg.originPlaceId];
                const placeOutboundDestination = search.content.results.places[quote.outboundLeg.destinationPlaceId];
                const dateOutbound = new Date(Number(quote.outboundLeg.quoteCreationTimestamp) * 1000);
                const dateInbound = new Date(Number(quote.inboundLeg.quoteCreationTimestamp) * 1000);
                const dateOutboundFlight = new Date(
                  quote.outboundLeg.departureDateTime.year,
                  quote.outboundLeg.departureDateTime.month,
                  quote.outboundLeg.departureDateTime.day,
                  quote.outboundLeg.departureDateTime.hour,
                  quote.outboundLeg.departureDateTime.minute,
                );
                const dateInboundFlight = new Date(
                  quote.inboundLeg.departureDateTime.year,
                  quote.inboundLeg.departureDateTime.month,
                  quote.inboundLeg.departureDateTime.day,
                  quote.inboundLeg.departureDateTime.hour,
                  quote.inboundLeg.departureDateTime.minute,
                );
                const dateOutboundAgo = formatDistance(
                  dateOutbound,
                  new Date(),
                  { addSuffix: true }
                );
                const dateInboundAgo = formatDistance(
                  dateInbound,
                  new Date(),
                  { addSuffix: true }
                );
                const tripDays = formatDistance(
                  dateOutboundFlight,
                  dateInboundFlight,
                  { addSuffix: false }
                );

                return (<div className='border-2 border-gray-200 rounded-md mb-2 p-3 dark:border-gray-600'>
                  <div className='hidden'>
                    <div>Outbound:{placeOutboundOrigin.entityId} to {placeOutboundDestination.entityId}</div>
                    <div>Inbound:{placeOutboundOrigin.entityId} to {placeInboundDestination.entityId}</div>
                  </div>
                  <h3 style={{ marginTop: '0' }}>{placeOutboundDestination?.name} from {getPrice(quote.minPrice.amount, quote.minPrice.unit)}</h3>
                  <div><b>Outbound</b></div>
                  <div>{placeOutboundOrigin?.name} to {placeOutboundDestination?.name} on <b>{format(dateOutboundFlight, 'EEE, dd MMM')}</b> <br />(checked {dateOutboundAgo})
                  </div>
                  <div><b>Inbound</b></div>
                  <div>{placeInboundOrigin?.name} to {placeInboundDestination?.name} on <b>{format(dateInboundFlight, 'EEE, dd MMM')}</b> <br />(checked {dateInboundAgo})
                  </div>
                  <div>Trip is <b>{tripDays}</b> long</div>
                  <div><Link className='button' to={`/search-flight/${placeOutboundOrigin?.iata}/${placeOutboundDestination?.iata}/${convertDateToYYYMMDDFormat(dateOutboundFlight)}/${format(dateInboundFlight, 'yyyy-MM-dd')}`}>Search Deal</Link></div>
                </div>);

              })}
            </>
          ) : ''}
        </div>
      </>)}
    </>
  );
};
