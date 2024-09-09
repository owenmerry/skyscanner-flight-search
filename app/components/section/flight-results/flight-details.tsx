import type { FlightSDK } from "~/helpers/sdk/flight/flight-functions";
import type { QueryPlace } from "~/types/search";
import { FlightTimeline } from "./flight-timeline";
import { Leg } from "./flight-leg";
import { PanelTop } from "./flight-panel-top";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";

interface FlightDetailsProps {
  flight: FlightSDK;
  query: QueryPlace;
}

export const FlightDetails = ({ flight, query }: FlightDetailsProps) => {
  return (
    <div className="">
      <PanelTop
        icon={<FaPlaneDeparture className="inline mr-2 text-blue-600" />}
        title="Departure"
        detailsTitle="Trip Details"
        childrenTop={
          <div className="my-5">
            <Leg leg={flight.legs[0]} />
          </div>
        }
      >
        <div className="m-5">
          <FlightTimeline query={query} leg={flight.legs[0]} showStopOvers />
        </div>
      </PanelTop>
      {flight.legs[1] ? (
        <PanelTop
          icon={<FaPlaneArrival className="inline mr-2 text-blue-600" />}
          title="Return"
          detailsTitle="Trip Details"
          childrenTop={
            <div className="m-5">
              <Leg leg={flight.legs[1]} />
            </div>
          }
        >
          <div className="m-5">
            <FlightTimeline query={query} leg={flight.legs[1]} showStopOvers />
          </div>
        </PanelTop>
      ) : (
        ""
      )}
    </div>
  );
};
