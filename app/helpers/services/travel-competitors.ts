import { QueryPlace } from "~/types/search";

// Constants for Kayak
const KAYAK_API_KEY = "YOUR_KAYAK_API_KEY";

interface ErrorResponse {
  error: string;
}
export interface KiwiSearchResponse {
  data: {
    fare: {
      adults: number;
      children: number;
      infants: number;
    };
    deep_link: string;
  }[];
}

// Constants for Google Flights
const GOOGLE_FLIGHTS_API_KEY = "YOUR_GOOGLE_FLIGHTS_API_KEY";

// Constants for British Airways
const BRITISH_AIRWAYS_API_KEY = "YOUR_BRITISH_AIRWAYS_API_KEY";

// Constants for Ryanair
const RYANAIR_API_KEY = "YOUR_RYANAIR_API_KEY";

// Function to search flights using Kayak
export const fetchFlightsKayak = async () => {
  try {
    const response = await fetch(
      `https://api.kayak.com/hackerfares?apikey=${KAYAK_API_KEY}&origin=NYC&destination=LON&depart_date=2024-05-01&return_date=2024-05-07`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to search flights using Google Flights
export const fetchFlightsGoogleFlights = async () => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/qpxExpress/v1/trips/search?key=${GOOGLE_FLIGHTS_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: {
            passengers: {
              adultCount: 1,
            },
            slice: [
              {
                origin: "NYC",
                destination: "LON",
                date: "2024-05-01",
              },
            ],
            solutions: 10,
          },
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to search flights using Kiwi
export const fetchFlightsKiwi = async (
  query: QueryPlace,
  apiUrl: string
): Promise<KiwiSearchResponse | ErrorResponse> => {
  try {
    const response = await fetch(
      `${apiUrl}/service/kiwi/search?from=${query.from.iata}&to=${
        query.to.iata
      }&depart=${query.depart}${query.return ? `&return=${query.return}` : ""}`
    );
    const data: KiwiSearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    const errorResponse = { error: "Error on Kiwi Search" };

    return errorResponse;
  }
};

// Function to search flights using British Airways
export const fetchFlightsBritishAirways = async () => {
  try {
    const response = await fetch(
      `https://api.ba.com/flights?origin=NYC&destination=LON&date=2024-05-01&apikey=${BRITISH_AIRWAYS_API_KEY}`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to search flights using Ryanair
export const fetchFlightsRyanair = async () => {
  try {
    const response = await fetch(
      `https://api.ryanair.com/ta-public/v1/flightinfo/3/availability?departureAirportIataCode=NYC&arrivalAirportIataCode=LON&fromDate=2024-05-01&toDate=2024-05-07&apiKey=${RYANAIR_API_KEY}`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
