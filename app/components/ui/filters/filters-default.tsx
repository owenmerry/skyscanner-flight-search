import { Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import type { SearchFilters } from "~/helpers/sdk/filters";
import { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { QueryPlace } from "~/types/search";
import { track } from "@amplitude/analytics-browser";
import { Button } from "../button/button";

interface FiltersDefaultProps {
  flights?: SearchSDK;
  query?: QueryPlace;
  onFilterChange: (filters: SearchFilters) => void;
  defaultFilters?: SearchFilters;
}

export const FiltersDefault = ({
  onFilterChange,
  flights,
  query,
  defaultFilters = {},
}: FiltersDefaultProps) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [filtersChanged, setFiltersChanged] =
    useState<SearchFilters>(defaultFilters);
  const [filtersDebounced] = useDebounce(filters, 100);
  const showExtraFilters = false;

  const updateStops = (
    arr: number[] | undefined,
    value: number,
    checked: boolean
  ) => {
    let stopsUpdated = arr ? arr : [];
    stopsUpdated = stopsUpdated.filter((item) => item !== value);
    if (checked) {
      stopsUpdated.push(value);
    }
    updateFilters({ numberOfStops: stopsUpdated });
  };

  useEffect(() => {
    onFilterChange && onFilterChange(filtersDebounced);
  }, [filtersDebounced]);

  useEffect(() => {}, [defaultFilters]);

  const updateAgentTypes = (
    arr:
      | (
          | "AGENT_TYPE_TRAVEL_AGENT"
          | "AGENT_TYPE_AIRLINE"
          | "AGENT_TYPE_UNSPECIFIED"
        )[]
      | undefined,
    value:
      | "AGENT_TYPE_TRAVEL_AGENT"
      | "AGENT_TYPE_AIRLINE"
      | "AGENT_TYPE_UNSPECIFIED",
    checked: boolean
  ) => {
    let agentTypesUpdated = arr ? arr : [];
    agentTypesUpdated = agentTypesUpdated.filter((item) => item !== value);
    if (checked) {
      agentTypesUpdated.push(value);
    }
    updateFilters({ agentTypes: agentTypesUpdated });
  };

  const updateFilters = (filterAdd: SearchFilters) => {
    track("changed filters on search", {
      name: Object.keys(filterAdd)[0],
      ...filterAdd,
    });
    const filtersUpdated = { ...filters, ...filterAdd };
    setFilters(filtersUpdated);
    setFiltersChanged(filtersUpdated);
  };
  const updateFiltersChanged = (filterAdd: SearchFilters) => {
    const filtersUpdated = { ...filtersChanged, ...filterAdd };
    setFiltersChanged(filtersUpdated);
  };

  function valuetext(value: number) {
    return `${value}:00`;
  }

  return (
    <>
      {/* drawer component */}
      <form
        action="#"
        method="get"
        id="drawer-example"
        className="py-2"
        tabIndex={-1}
        aria-labelledby="drawer-label"
      >
        <h5
          id="drawer-label"
          className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          Filters
        </h5>
        <div className="flex flex-col justify-between flex-1">
          <div className="space-y-4">
            <div className="w-full border-b border-gray-300 dark:border-gray-800 pb-6">
              <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                Stops
              </h6>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="blue"
                    type="checkbox"
                    checked={!!filters.numberOfStops!?.includes(0)}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(e) =>
                      updateStops(filters.numberOfStops, 0, e.target.checked)
                    }
                  />
                  <label
                    htmlFor="blue"
                    className="flex items-center ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Direct
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="gray"
                    type="checkbox"
                    checked={!!filters.numberOfStops!?.includes(1)}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(e) =>
                      updateStops(filters.numberOfStops, 1, e.target.checked)
                    }
                  />
                  <label
                    htmlFor="gray"
                    className="flex items-center ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    1 Stop
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="green"
                    type="checkbox"
                    checked={!!filters.numberOfStops!?.includes(2)}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(e) =>
                      updateStops(filters.numberOfStops, 2, e.target.checked)
                    }
                  />
                  <label
                    htmlFor="green"
                    className="flex items-center ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    2 Stops
                  </label>
                </div>
              </div>
            </div>

            <div className="w-full border-b border-gray-300 dark:border-gray-800 pb-6">
              <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                Booking Options
              </h6>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="blue"
                    type="checkbox"
                    checked={
                      !!filters.agentTypes!?.includes("AGENT_TYPE_AIRLINE")
                    }
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(e) =>
                      updateAgentTypes(
                        filters.agentTypes,
                        "AGENT_TYPE_AIRLINE",
                        e.target.checked
                      )
                    }
                  />
                  <label
                    htmlFor="blue"
                    className="flex items-center ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Airlines
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="gray"
                    type="checkbox"
                    checked={
                      !!filters.agentTypes!?.includes("AGENT_TYPE_TRAVEL_AGENT")
                    }
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(e) =>
                      updateAgentTypes(
                        filters.agentTypes,
                        "AGENT_TYPE_TRAVEL_AGENT",
                        e.target.checked
                      )
                    }
                  />
                  <label
                    htmlFor="gray"
                    className="flex items-center ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Travel Agents
                  </label>
                </div>
              </div>
            </div>

            <div className="w-full border-b border-gray-300 dark:border-gray-800 pb-6">
              <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                Features
              </h6>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="blue"
                    type="checkbox"
                    checked={!!filters.mashup}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(e) =>
                      updateFilters({ mashup: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="blue"
                    className="flex items-center ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Mashups
                  </label>
                </div>
              </div>
            </div>

            <div className="w-full pr-3 border-b border-gray-300 dark:border-gray-800 pb-6">
              <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                Departure from {query?.from.iata}
              </h6>
              <button
                type="button"
                className="px-3 py-2 text-xs text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={() => {
                  updateFilters({
                    outboundTime: {
                      min: 0,
                      max: 8,
                    },
                  });
                }}
              >
                Before Work
              </button>
              <button
                type="button"
                className="px-3 py-2 text-xs text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={() => {
                  updateFilters({
                    outboundTime: {
                      min: 18,
                      max: 23,
                    },
                  });
                }}
              >
                After Work
              </button>
              <div className="space-y-2">
                <div className="">
                  <div className="text-sm">
                    {filtersChanged.outboundTime?.min || 0}:00 -{" "}
                    {filtersChanged.outboundTime?.max || 23}:59
                  </div>
                  <div className="m-2">
                    <Slider
                      getAriaLabel={() => "Temperature range"}
                      value={[
                        filtersChanged.outboundTime?.min || 0,
                        filtersChanged.outboundTime?.max || 23,
                      ]}
                      onChange={(e, value) => {
                        if (!Array.isArray(value)) return;
                        updateFiltersChanged({
                          outboundTime: {
                            min: value[0] || 0,
                            max: value[1] || 23,
                          },
                        });
                      }}
                      onChangeCommitted={(e, value) => {
                        if (!Array.isArray(value)) return;
                        updateFilters({
                          outboundTime: {
                            min: value[0] || 0,
                            max: value[1] || 23,
                          },
                        });
                      }}
                      valueLabelDisplay="off"
                      getAriaValueText={valuetext}
                      min={0}
                      max={23}
                    />
                  </div>
                </div>
              </div>
            </div>

            {query?.return ? (
              <div className="w-full pr-3 border-b border-gray-300 dark:border-gray-800 pb-6">
                <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                  Return from {query?.to.iata}
                </h6>
                <button
                  type="button"
                  className="px-3 py-2 text-xs text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                  onClick={() => {
                    updateFilters({
                      returnTime: {
                        min: 0,
                        max: 8,
                      },
                    });
                  }}
                >
                  Before Work
                </button>
                <button
                  type="button"
                  className="px-3 py-2 text-xs text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                  onClick={() => {
                    updateFilters({
                      returnTime: {
                        min: 18,
                        max: 23,
                      },
                    });
                  }}
                >
                  After Work
                </button>
                <div className="space-y-2">
                  <div className="">
                    <div className="text-sm">
                      {filtersChanged.returnTime?.min || 0}:00 -{" "}
                      {filtersChanged.returnTime?.max || 23}:59
                    </div>
                    <div className="m-2">
                      <Slider
                        getAriaLabel={() => "Temperature range"}
                        value={[
                          filtersChanged.returnTime?.min || 0,
                          filtersChanged.returnTime?.max || 23,
                        ]}
                        onChange={(e, value) => {
                          if (!Array.isArray(value)) return;
                          updateFiltersChanged({
                            returnTime: {
                              min: value[0] || 0,
                              max: value[1] || 23,
                            },
                          });
                        }}
                        onChangeCommitted={(e, value) => {
                          if (!Array.isArray(value)) return;
                          updateFilters({
                            returnTime: {
                              min: value[0] || 0,
                              max: value[1] || 23,
                            },
                          });
                        }}
                        valueLabelDisplay="off"
                        getAriaValueText={valuetext}
                        min={0}
                        max={23}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="w-full pr-3 border-b border-gray-300 dark:border-gray-800 pb-6">
              <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                Duration
              </h6>
              <div className="space-y-2">
                <div className="">
                  <div className="text-sm">
                    Up to {filters.duration || 60} hours
                  </div>
                  <div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      defaultValue={filters.duration ? filters.duration : 60}
                      step={1}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      onChange={(e) =>
                        updateFilters({
                          duration: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {showExtraFilters ? (
              <>
                {/* Price */}
                <div>
                  <h6 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Price Range
                  </h6>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        id="min-price"
                        type="range"
                        min={0}
                        max={7000}
                        defaultValue={300}
                        step={1}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <input
                        id="max-price"
                        type="range"
                        min={0}
                        max={7000}
                        defaultValue={3500}
                        step={1}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                    <div className="flex items-center justify-between col-span-2 space-x-4">
                      <div className="w-full">
                        <label
                          htmlFor="min-price-input"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          From
                        </label>
                        <input
                          type="number"
                          id="min-price-input"
                          defaultValue={300}
                          min={0}
                          max={7000}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                          placeholder=""
                          required
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="max-price-input"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          To
                        </label>
                        <input
                          type="number"
                          id="max-price-input"
                          defaultValue={3500}
                          min={0}
                          max={7000}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                    Airports
                  </h6>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="blue"
                        type="checkbox"
                        defaultValue=""
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="blue"
                        className="flex items-center ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Standsted
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="gray"
                        type="checkbox"
                        defaultValue=""
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="gray"
                        className="flex items-center ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Luton
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="green"
                        type="checkbox"
                        defaultValue=""
                        defaultChecked
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="green"
                        className="flex items-center ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        London City
                      </label>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                    Rating
                  </h6>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="five-stars"
                        type="radio"
                        defaultValue=""
                        name="rating"
                        className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="five-stars"
                        className="flex items-center ml-2"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>First star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Second star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Third star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fourth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fifth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="four-stars"
                        type="radio"
                        defaultValue=""
                        name="rating"
                        className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="four-stars"
                        className="flex items-center ml-2"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>First star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Second star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Third star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fourth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fifth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="three-stars"
                        type="radio"
                        defaultValue=""
                        name="rating"
                        defaultChecked
                        className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="three-stars"
                        className="flex items-center ml-2"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>First star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Second star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Third star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fourth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fifth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="two-stars"
                        type="radio"
                        defaultValue=""
                        name="rating"
                        className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="two-stars"
                        className="flex items-center ml-2"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>First star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Second star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Third star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fourth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fifth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="one-star"
                        type="radio"
                        defaultValue=""
                        name="rating"
                        className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="one-star"
                        className="flex items-center ml-2"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>First star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Second star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Third star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fourth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fifth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </form>
    </>
  );
};
