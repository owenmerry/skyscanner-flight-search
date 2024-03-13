import { Wrapper } from "@googlemaps/react-wrapper";
import { Map } from "~/components/ui/map";
import { getMarkersMapSearchComponent } from "~/helpers/map";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { getPlaceFromEntityId } from "~/helpers/sdk/place";

export const MapSearch = ({
  googleApiKey,
  googleMapId,
  indicativeSearch,
  title = "Explore By Map",
  zoom = 2,
  centerEntity = "27544008",
}: {
  googleApiKey: string;
  googleMapId: string;
  title?: string;
  indicativeSearch: SkyscannerAPIIndicativeResponse | undefined;
  zoom?: number;
  centerEntity?: string;
}) => {
  const centerPlace = getPlaceFromEntityId(centerEntity);

  if (!centerPlace) return;

  return (
    <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
        {title}
      </h2>
      <Wrapper apiKey={googleApiKey}>
        <Map
          googleMapId={googleMapId}
          center={{
            lat: centerPlace.coordinates.latitude,
            lng: centerPlace.coordinates.longitude,
          }}
          zoom={zoom}
          markers={getMarkersMapSearchComponent(indicativeSearch, centerPlace)}
          isFitZoomToMarkers={zoom === 0}
        />
      </Wrapper>
    </div>
  );
};
