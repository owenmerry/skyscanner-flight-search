import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./multi-range-slider.css";

export const MultiRangeSlider = ({
  min = 0,
  max = 100,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (values: { min: number; max: number }) => void;
}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="container relative flex">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="thumb thumb--left absolute"
        style={{ zIndex: 5 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="thumb thumb--right absolute"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>

      <div className="h-screen flex justify-center items-center">
        <div
          x-data="range()"
          x-init="mintrigger(); maxtrigger()"
          className="relative max-w-xl w-full"
        >
          <div>
            <input
              type="range"
              step={100}
              x-bind:min="min"
              x-bind:max="max"
              x-on:input="mintrigger"
              x-model="minprice"
              className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
            />
            <input
              type="range"
              step={100}
              x-bind:min="min"
              x-bind:max="max"
              x-on:input="maxtrigger"
              x-model="maxprice"
              className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
            />
            <div className="relative z-10 h-2">
              <div className="absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md bg-gray-200" />
              <div
                className="absolute z-20 top-0 bottom-0 rounded-md bg-green-300"
                x-bind:style="'right:'+maxthumb+'%; left:'+minthumb+'%'"
              />
              <div
                className="absolute z-30 w-6 h-6 top-0 left-0 bg-green-300 rounded-full -mt-2 -ml-1"
                style={{ left: `${getPercent(minVal)}%` }}
              />
              <div
                className="absolute z-30 w-6 h-6 top-0 right-0 bg-green-300 rounded-full -mt-2 -mr-3"
                style={{ right: `${getPercent(maxVal) - 100}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center py-5">
            <div>
              <input
                type="text"
                maxLength={5}
                x-on:input="mintrigger"
                x-model="minprice"
                className="px-3 py-2 border border-gray-200 rounded w-24 text-center"
              />
            </div>
            <div>
              <input
                type="text"
                maxLength={5}
                x-on:input="maxtrigger"
                x-model="maxprice"
                className="px-3 py-2 border border-gray-200 rounded w-24 text-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
