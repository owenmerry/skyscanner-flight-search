import moment from "moment";
import React, { useState } from "react";
import { FaCarSide, FaHotel, FaPlaneDeparture } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { DayViewDrawer } from "./drawer-day-view";
import { EventViewDrawer } from "./drawer-event-view";

interface TripPlan {
  days: {
    date: string;
    events: {
      type: "flight" | "hotel" | "car" | "activity";
      name?: string;
    }[];
  }[];
}

interface TripTimelineProps {}
export const TripTimeline = ({}: TripTimelineProps) => {
  const [dayView, setDayView] = useState<string>();
  const [eventView, setEventView] = useState<number>();
  const trip: TripPlan = {
    days: [
      { date: "2025-02-01", events: [{ type: "flight" }, { type: "hotel" }] },
      {
        date: "2025-02-02",
        events: [{ type: "activity", name: "Scuba Diving" }],
      },
      {
        date: "2025-02-03",
        events: [{ type: "activity", name: "Scuba Diving" }, { type: "car hire" }],
      },
      { date: "2025-02-04", events: [{ type: "flight" }] },
    ],
  };
  const dayViewItem =
    (dayView && trip.days.filter((item) => dayView === item.date)[0]) ||
    undefined;
  const eventViewItem =
    eventView !== undefined && dayViewItem !== undefined && dayViewItem !== undefined
      ? dayViewItem.events[eventView]
      : undefined;
  return (
    <div>
      <div className="px-4 py-4">
        <div onClick={() => setDayView(undefined)}>Close</div>
        {dayView} - {eventView}
        <ol className="relative">
          {trip.days.map((day, key) => {
            return (
              <React.Fragment key={day.date}>
                {/* day details */}
                <li className="ml-8 cursor-pointer" onClick={() => setDayView(day.date)}>
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
                    <MdDateRange />
                  </span>
                  <div>
                    Day {key + 1}
                  </div>
                </li>
                {/* info */}
                <li className="relative ml-8">
                  <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {moment(trip.days[0].date).format("dddd, Do MMMM")}
                  </h3>
                </li>
                {/* events */}
                <li className="py-2 ml-8 relative">
                  <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
                  {day.events.map((event, key) => {
                    return (
                      <React.Fragment key={key}>
                        <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                          <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                            {event.type === "activity"
                              ? event.name
                              : event.type}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
        <DayViewDrawer
          isOpen={dayView !== undefined}
          onClose={() => setDayView(undefined)}
        >
          <div className="px-4 py-4">
            <ol className="relative">
              <li className="ml-8">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
                  <MdDateRange />
                </span>
                <div>Day {dayViewItem?.date}</div>
              </li>
              <li className="py-2 ml-8 relative">
                <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
                {dayViewItem?.events.map((event, key) => {
                  return (
                    <React.Fragment key={key}>
                      <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 cursor-pointer" onClick={() => setEventView(key)}>
                        <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                          {event.type === "activity" ? event.name : event.type}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </li>
            </ol>
          </div>
        </DayViewDrawer>
        <EventViewDrawer
          isOpen={eventViewItem !== undefined}
          onClose={() => setEventView(undefined)}
        >
          <div className="px-4 py-4">
            <ol className="relative">
              <li className="ml-8">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
                  <MdDateRange />
                </span>
                <div>Event {eventViewItem?.type}</div>
              </li>
            </ol>
          </div>
        </EventViewDrawer>
      </div>
    </div>
  );
};
