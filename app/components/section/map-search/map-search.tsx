import { Wrapper } from "@googlemaps/react-wrapper";
import { Map } from "~/components/ui/map";
import { getMarkersMapSearchComponent } from "~/helpers/map";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";

export const MapSearch = ({
  googleApiKey,
  googleMapId,
  indicativeSearch,
  title = "Explore By Map",
  zoom = 2,
}: {
  googleApiKey: string;
  googleMapId: string;
  title?: string;
  indicativeSearch: SkyscannerAPIIndicativeResponse | undefined;
  zoom?: number;
}) => {
  return (
    <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
        {title}
      </h2>
      <Wrapper apiKey={googleApiKey}>
        <Map
          googleMapId={googleMapId}
          center={{ lat: 0, lng: 0 }}
          zoom={zoom}
          markers={getMarkersMapSearchComponent(indicativeSearch)}
        />
      </Wrapper>
    </div>
  );
};
