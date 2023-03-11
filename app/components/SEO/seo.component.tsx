import { useState, useEffect, useCallback } from 'react';
import { formatDistance, format } from 'date-fns';
import { getPrice } from '~/helpers/sdk/price';
import { Link } from '@remix-run/react';
import { convertDateToYYYMMDDFormat } from '~/helpers/date';
import { Map } from '~/components/map';
import { Wrapper } from "@googlemaps/react-wrapper";

interface SkyscannerAPIIndicitiveResponse {
  status: string;
  content: {
    results: {
      quotes: {
        [key: string]: {
          minPrice: {
            amount: string;
            unit: string;
            updateStatus: string;
          }
          isDirect: boolean;
          outboundLeg: {
            originPlaceId: string;
            destinationPlaceId: string;
            departureDateTime: {
              year: number;
              month: number;
              day: number;
              hour: number;
              minute: number;
              second: number;
            };
            quoteCreationTimestamp: string;
            marketingCarrierId: string;
          };
          inboundLeg: {
            originPlaceId: string;
            destinationPlaceId: string;
            departureDateTime: {
              year: number;
              month: number;
              day: number;
              hour: number;
              minute: number;
              second: number;
            };
            quoteCreationTimestamp: string;
            marketingCarrierId: string;
          }
        }
      };
      places: {
        [key: string]: {
          entityId: string;
          name: string;
          type: string;
          iata: string;
          coordinates: {
            latitude: number;
            longitude: number;
          }
        };
      };
    };
    groupingOptions: {
      byRoute: {
        quotesGroups: {
          originPlaceId: string;
          destinationPlaceId: string;
          quoteIds: string[];
        }[];
      }
    };
  }
}

interface SEOProps {
  apiUrl: string;
  googleApiKey: string;
  query: {
    from: string;
    to: string;
    month: string;
  };
}

export const SEO = ({
  apiUrl,
  googleApiKey,
  query,
}: SEOProps): JSX.Element => {
  const [search, setSearch] = useState<SkyscannerAPIIndicitiveResponse>();
  const [filter, setFilter] = useState<number | undefined>();

  const handleSearch = useCallback(async () => {
    try {
      const res = await fetch(
        `${apiUrl}/price?from=${query.from}&month=${query.month}`);
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

  const sortByPrice = (quoteGroups: any) => {
    const sorted = quoteGroups.sort(function (a, b) {
      const quoteA: any = search?.content.results.quotes[a.quoteIds[0]];
      const quoteB: any = search?.content.results.quotes[b.quoteIds[0]];

      return quoteA.minPrice.amount - quoteB.minPrice.amount;
    });

    return sorted;
  }

  const filterItems = (quoteGroups: any) => {
    return quoteGroups.filter((quoteGroup) => {
      const quote: any = search?.content.results.quotes[quoteGroup.quoteIds[0]];
      if (!filter) return true;

      return quote.minPrice.amount <= filter;
    });
  }

  const getMarkers = (): { location: google.maps.LatLngLiteral; label: string; }[] | null => {
    if (!search) return null;
    const markers = filterItems(search.content.groupingOptions.byRoute.quotesGroups).map((quoteKey) => {
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
      );
      const dateInboundFlight = new Date(
        quote.inboundLeg.departureDateTime.year,
        quote.inboundLeg.departureDateTime.month,
        quote.inboundLeg.departureDateTime.day,
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


      return {
        location: {
          lat: placeOutboundDestination.coordinates.latitude,
          lng: placeOutboundDestination.coordinates.longitude,
        },
        label: `${placeOutboundDestination.name} for ${getPrice(quote.minPrice.amount, quote.minPrice.unit)} and ${tripDays} long, ${format(dateOutboundFlight, 'EEE, dd MMM')} to ${format(dateInboundFlight, 'EEE, dd MMM')}`,
      }
    });
    return markers;
  }

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(Number(e.target.value));
  }


  return (
    <>
      seo results
      {!search ? '' : (<>
        <div className='panel'>
          <div>Filter: <input value={filter || ''} onChange={handleFilter} /></div>
        </div>
        <Wrapper apiKey={googleApiKey}>
          <Map center={{ lat: 51.509865, lng: -0.118092 }} zoom={5} markers={getMarkers()} />
        </Wrapper>
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
          );
          const dateInboundFlight = new Date(
            quote.inboundLeg.departureDateTime.year,
            quote.inboundLeg.departureDateTime.month,
            quote.inboundLeg.departureDateTime.day,
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


          return (<div className='panel'>
            <h3 style={{ marginTop: '0' }}>{placeOutboundDestination?.name} from {getPrice(quote.minPrice.amount, quote.minPrice.unit)}</h3>
            <div><b>Outbound</b></div>
            <div>{placeOutboundOrigin?.name} to {placeOutboundDestination?.name} on <b>{format(dateOutboundFlight, 'EEE, dd MMM')}</b> <br />(checked {dateOutboundAgo})
            </div>
            <div><b>Inbound</b></div>
            <div>{placeInboundOrigin?.name} to {placeInboundDestination?.name} on <b>{format(dateInboundFlight, 'EEE, dd MMM')}</b> <br />(checked {dateInboundAgo})
            </div>
            <div>Trip is <b>{tripDays}</b> long</div>
            <div><Link className='button' to={`/search/${placeOutboundOrigin?.iata}/${placeOutboundDestination?.iata}/${convertDateToYYYMMDDFormat(dateOutboundFlight)}/${format(dateInboundFlight, 'yyyy-MM-dd')}`}>Search Deal</Link></div>
          </div>);

        })}
      </>)}
    </>
  );
};
