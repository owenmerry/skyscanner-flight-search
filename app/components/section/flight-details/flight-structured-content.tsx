import type { FlightSDK } from "~/helpers/sdk/flight/flight-functions";
import type { QueryPlace } from "~/types/search";

export interface FlightStructuredContentProps {
  flight: FlightSDK;
  query: QueryPlace;
}

export const FlightStructuredContent = ({
  flight,
  query,
}: FlightStructuredContentProps) => {
  const flightStructured = query.return
    ? {
        "@context": "https://schema.org",
        "@type": "Flight",
        name: `Flight from ${query.from.name} to ${query.to.name}`,
        flightNumber: flight.legs[0].segments[0].flightNumber,
        airline: {
          "@type": "Airline",
          name: flight.legs[0].segments[0].marketingCarrier?.name,
        },
        departureAirport: {
          "@type": "Airport",
          name: flight.legs[0].fromPlace?.name,
          iataCode: flight.legs[0].fromPlace?.iata,
        },
        arrivalAirport: {
          "@type": "Airport",
          name: flight.legs[0].toPlace?.name,
          iataCode: flight.legs[0].toPlace?.iata,
        },
        departureTime: flight.legs[0].departure,
        arrivalTime: flight.legs[0].arrival,
        returnFlight: {
          "@type": "Flight",
          flightNumber: flight.legs[flight.legs.length - 1].segments[0].flightNumber,
          departureAirport: {
            "@type": "Airport",
            name: flight.legs[flight.legs.length - 1].fromPlace?.name,
            iataCode: flight.legs[flight.legs.length - 1].fromPlace?.iata,
          },
          arrivalAirport: {
            "@type": "Airport",
            name: flight.legs[flight.legs.length - 1].toPlace?.name,
            iataCode: flight.legs[flight.legs.length - 1].toPlace?.iata,
          },
          departureTime: flight.legs[flight.legs.length - 1].departure,
          arrivalTime: flight.legs[flight.legs.length - 1].arrival,
        },
        offers: {
          "@type": "Offer",
          price: flight.prices[0].priceRaw,
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          url: flight.prices[0].deepLinks[0].link,
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "Flight",
        name: `Flight from ${query.from.name} to ${query.to.name}`,
        flightNumber: flight.legs[0].segments[0].flightNumber,
        airline: {
          "@type": "Airline",
          name: flight.legs[0].segments[0].marketingCarrier?.name,
        },
        departureAirport: {
          "@type": "Airport",
          name: flight.legs[0].fromPlace?.name,
          iataCode: flight.legs[0].fromPlace?.iata,
        },
        arrivalAirport: {
          "@type": "Airport",
          name: flight.legs[0].toPlace?.name,
          iataCode: flight.legs[0].toPlace?.iata,
        },
        departureTime: flight.legs[0].departure,
        arrivalTime: flight.legs[0].arrival,
        offers: {
          "@type": "Offer",
          price: flight.prices[0].priceRaw,
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          url: flight.prices[0].deepLinks[0].link,
        },
      };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(flightStructured) }}
    />
  );
};
