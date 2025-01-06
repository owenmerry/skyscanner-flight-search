import type {
  SkyscannerAPICarHireIndicativeResponse,
  SkyscannerAPICarHireIndicativeResponseError,
} from "./care-hire-indicative-response";
import { getPrice } from "../price";
import { getVehicleTypeDisplay } from "./car-hire-indicative-functions";

// SDK Types
export interface CarHireIndicativeSDK {
  search: CarHireSDK | { error: string };
}

export interface CarHireIndicativeQuery {
  from: string;
  depart?: string;
  return?: string;
  groupType?: "month" | "day";
}

export const getCarHireIndicativeSDK = async ({
  res,
  query,
  apiUrl,
}: {
  res?: SkyscannerAPICarHireIndicativeResponse;
  query?: CarHireIndicativeQuery;
  apiUrl?: string;
}): Promise<CarHireIndicativeSDK> => {
  const search = res
    ? res
    : await getCarHireIndicative({
        apiUrl: apiUrl ? apiUrl : "",
        query,
      });
  if ("error" in search)
    return {
      search,
    };

  const carHireSDK = mapCarHireResponseToSDK(search);

  return {
    search: carHireSDK,
  };
};

export const getCarHireIndicative = async ({
  apiUrl,
  query,
}: {
  apiUrl?: string;
  query?: CarHireIndicativeQuery;
}) => {
  let carHire,
    error = "";
  if (!query) return { error: "Query is required" };
  try {
    const res = await fetch(
      `${apiUrl}/car-hire/price?from=${query.from}${
        query.depart ? `&depart=${query.depart}` : ""
      }${query.return ? `&return=${query.return}` : ""}${
        query.groupType
          ? `&groupType=${
              query.groupType === "month"
                ? "DATE_TIME_GROUPING_TYPE_BY_MONTH"
                : ""
            }${
              query.groupType === "day"
                ? "DATE_TIME_GROUPING_TYPE_BY_DATE"
                : ""
            }`
          : ""
      }`
    );
    const json:
      | SkyscannerAPICarHireIndicativeResponse
      | SkyscannerAPICarHireIndicativeResponseError = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else if ("error" in json) {
      error = `${json.error}`;
    } else if ("status" in json) {
      carHire = json;
    } else {
      error = "That's is odd, we had a issue with the request.";
    }
  } catch (ex) {}

  return carHire || { error };
};

export interface CarHireSDK {
  status: string;
  results: ResultSDK[];
}

export interface ResultSDK {
  quoteId: string;
  vehicleType: string;
  vehicleTypeDisplay: string;
  seats: number;
  bags: number;
  prices: {
    aggregateType: string;
    price: {
      amount: string;
      amountDisplay: string;
      unit: string;
      updateStatus: string;
    };
  }[];
  stats: {
    cheapest?: string;
  };
  imageUrl: string;
  deeplinkUrl: string;
  monthOfYear: number;
  vendorId: number;
}

const mapCarHireResponseToSDK = (
  res: SkyscannerAPICarHireIndicativeResponse
): CarHireSDK => {
  const quotes = Object.keys(res.content.results.quotes).map((quoteKey) => {
    const quote = res.content.results.quotes[quoteKey];
    const prices = quote.prices.map((price) => ({
      ...price,
      price: {
        ...price.price,
        amountDisplay: getPrice(price.price.amount, price.price.unit),
      },
    }));
    return {
      quoteId: quoteKey,
      ...quote,
      vehicleTypeDisplay: getVehicleTypeDisplay(quote.vehicleType),
      prices: prices,

      stats: {
        cheapest: quote.prices
          .filter((item) => item.aggregateType === "AGGREGATE_TYPE_CHEAPEST")
          .map((price) => getPrice(price.price.amount, price.price.unit))[0],
        average: quote.prices
          .filter((item) => item.aggregateType === "AGGREGATE_TYPE_AVERAGE")
          .map((price) => getPrice(price.price.amount, price.price.unit))[0],
        cheapestTotal: quote.prices
          .filter(
            (item) => item.aggregateType === "AGGREGATE_TYPE_TOTAL_CHEAPEST"
          )
          .map((price) => getPrice(price.price.amount, price.price.unit))[0],
        averageTotal: quote.prices
          .filter(
            (item) => item.aggregateType === "AGGREGATE_TYPE_TOTAL_AVERAGE"
          )
          .map((price) => getPrice(price.price.amount, price.price.unit))[0],
      },
    };
  });
  return {
    status: res.status,
    results: quotes,
  };
};
