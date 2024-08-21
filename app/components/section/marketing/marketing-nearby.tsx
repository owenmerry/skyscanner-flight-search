import { useEffect, useState } from "react";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";
import type { TripadvisorDetailsData } from "~/types/tripadvisor-details";
import { Skeleton } from "@mui/material";
import type { TripadvisorImagesData, TripadvisorImagesResponse } from "~/types/tripadvisor-images";
import type { TripadvisorNearByData, TripadvisorNearByResponse } from "~/types/tripadvisor-near-by";
import { tripSDKData } from "./helpers/data-tripadvisor";


export interface TripadvisorSDK {
  location: TripadvisorNearByData;
  images: TripadvisorImagesData[];
  details: TripadvisorDetailsData;
}

interface MarketingNearbyProps {
  search: IndicativeQuotesSDK[];
  to: Place;
  apiUrl: string;
}

export const MarketingNearby = ({ search, to, apiUrl }: MarketingNearbyProps) => {
  const [locations, setLocations] = useState<TripadvisorSDK[]>([]);

  const runLocations = async () => {
    const res = await fetch(
      `${apiUrl}/service/tripadvisor/locations?searchQuery=${to.name}`
    );
    const data: TripadvisorNearByResponse = await res.json();

    let tripSDK: TripadvisorSDK[] = [];
    const tripLocations = data.data.splice(0, 6);
    for (const tripLocation of tripLocations) {
      const resImages = await fetch(
        `${apiUrl}/service/tripadvisor/images?location_id=${tripLocation.location_id}`
      );
      const dataImages: TripadvisorImagesResponse = await resImages.json();

      const resDetails = await fetch(
        `${apiUrl}/service/tripadvisor/details?location_id=${tripLocation.location_id}`
      );
      const dataDetails: TripadvisorDetailsData = await resDetails.json();

      tripSDK.push({
        location: tripLocation,
        images: dataImages.data,
        details: dataDetails,
      });
    }

    setLocations(tripSDK);
  };

  useEffect(() => {
    runLocations();
  }, []);

  return (
    <div className="bg-blue-600 shadow-inner">
      <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 sm:text-center lg:py-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          What to do in {to.name}
        </h2>
        <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-white">
          We are strategists, designers and developers. Innovators and problem
          solvers. Small enough to be simple and quick, but big enough to
          deliver the scope you want at the pace you need.
        </p>
        <div className="relative my-3">
          <div className="bg-gradient-to-l from-blue-600 to-transparent absolute bottom-0 right-0 w-[20px] h-[100%] z-10 sm:hidden"></div>
          <div className="flex overflow-y-scroll scrollbar-hide sm:grid sm:grid-cols-3 gap-4">
            {locations.map((location) => {
              return (
                <div
                  key={location.location.location_id}
                  className="group/link min-w-96 sm:min-w-0 text-left shadow-lg bg-white rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100  dark:bg-white  dark:text-black"
                >
                  <a
                    href={`${location.details.web_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block"
                  >
                    <div
                      className="relative h-40 bg-cover bg-center bg-no-repeat rounded-t-lg"
                      style={{
                        backgroundImage: `url(${location.images[0].images.large.url})`,
                      }}
                    >
                      <div className="opacity-0 group-hover/link:opacity-10 transition ease-out bg-white absolute top-0 left-0 w-[100%] h-[100%] z-0 rounded-lg"></div>
                      <div className="bg-gradient-to-t from-slate-800 to-transparent absolute bottom-0 left-0 w-[100%] h-[30%] z-0 rounded-t-lg"></div>
                    </div>
                    <div className="p-4">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight  ">
                        {location.location.name}
                      </h5>
                      <p className="font-normal  dark:text-gray-400 mb-4 line-clamp-4">
                        {location.details.description}
                      </p>
                      <div className=" text-gray-700  font-bold">
                        <img
                          src={location.details.rating_image_url}
                          alt="tripadvisor rating"
                        />
                        <div className="mt-2">
                          {location.details.ranking_data.ranking_string}
                          </div>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}

            {locations.length === 0 ? (
              <>
                {Array.from(Array(6)).map((e, k) => (
                  <div
                    key={`skeleton-flight-${k}`}
                    className="min-w-72 sm:min-w-0 text-left shadow-lg bg-white rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100  dark:bg-white  dark:text-black"
                  >
                    <div className="relative block">
                      <div className="relative h-40 bg-cover bg-center bg-no-repeat rounded-t-lg bg-slate-200"></div>
                      <div className="p-4">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight  ">
                          <Skeleton width="60%" />
                        </h5>
                        <p className="h-8 font-normal  dark:text-gray-400 truncate">
                          <Skeleton />
                        </p>
                        <div className=" text-gray-700  font-bold">
                          <Skeleton width="30%" />
                          <Skeleton width="60%" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              ""
            )}
            <div className="w-[20px] sm:hidden"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
