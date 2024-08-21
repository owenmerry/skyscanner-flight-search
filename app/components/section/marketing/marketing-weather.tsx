import moment from "moment";
import { useEffect, useState } from "react";
import type { Place } from "~/helpers/sdk/place";
import type { WeatherForcastOpenMeteoResponse } from "~/types/weather";

interface MarketingWeatherProps {
  to: Place;
  apiUrl: string;
}

export const MarketingWeather = ({ to, apiUrl }: MarketingWeatherProps) => {
  const [weather, setWeather] = useState<WeatherForcastOpenMeteoResponse>();
  const maxTempeture = weather ? Math.max(...weather.hourly.temperature_2m) : undefined;
  const minTempeture = weather ?  Math.min(...weather.hourly.temperature_2m) : undefined;
  const getPercentageBar = (number: number, numberPercentage: number) => {
    return (
      100 - Math.ceil(((numberPercentage - number) / numberPercentage) * 100)
    );
  };

  const runWeather = async () => {
    const res = await fetch(
      `${apiUrl}/service/weather/forcast?latitude=${to.coordinates.latitude}&longitude=${to.coordinates.longitude}`
    );
    const data: WeatherForcastOpenMeteoResponse = await res.json();

    setWeather(data);
  };

  useEffect(() => {
    runWeather();
  }, []);

  return (
    <div className="bg-blue-600 shadow-inner">
      <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 sm:text-center lg:py-16">
        <div className="flex justify-center mb-4">
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
            />
          </svg>
        </div>
        <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Weather in {to.name}
        </h2>
        <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-white">
          We are strategists, designers and developers. Innovators and problem
          solvers. Small enough to be simple and quick, but big enough to
          deliver the scope you want at the pace you need.
        </p>
        <div className="relative my-8">
          <div className="grid grid-cols-1 gap-4">
            {weather?.hourly.time.map((time, key) => {
              const tempeture = weather.hourly.temperature_2m[key];
              return (
                <div key={`${time}`}>
                  <div className="grid grid-cols-10 content-center justify-items-center gap-1">
                    <div className="self-center font-bold">
                      {moment(time).format("ddd ha")}
                    </div>
                    <div className="bg-blue-800 w-full flex-1 rounded-lg col-span-9">
                      <div
                        className={`bg-blue-500 rounded-lg p-2 flex flex-row-reverse`}
                        style={{
                          width: `${
                            maxTempeture && minTempeture
                              ? getPercentageBar(
                                  Number(tempeture),
                                  Number(maxTempeture)
                                )
                              : "0"
                          }%`,
                        }}
                      >
                        <div
                          className={`bg-blue-600 text-white inline-block rounded-lg p-1 text-sm sm:p-2`}
                        >
                          {tempeture}{weather.current_units.temperature_2m}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
