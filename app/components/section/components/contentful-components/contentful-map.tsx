import { ContentfulComponent } from "~/helpers/sdk/content/content-response";
import { getNumberOrDefault, getStringOrDefault } from "../helpers/check";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { useEffect, useState } from "react";
import { MapSearch } from "../../map/map-search";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import moment from "moment";

export const ContentfulMap = ({
  component,
  apiUrl,
  googleApiKey,
  googleMapId,
}: {
  component: ContentfulComponent;
  apiUrl: string;
  googleApiKey: string;
  googleMapId: string;
}) => {
  const [search, setSearch] = useState<SkyscannerAPIIndicativeResponse>();

  useEffect(() => {
    runIndicative();
  }, []);

  const runIndicative = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: getStringOrDefault(component.fields["from"]),
        to: getStringOrDefault(component.fields["to"], "anywhere"),
        tripType: "return",
      },
      month: Number(moment().add(1, "months").format("M")),
    });

    if ("error" in indicativeSearch.search) return;
    if (!indicativeSearch.search.content.groupingOptions) return;

    setSearch(indicativeSearch.search);
  };

  return (
    <>
      {search ? (
        <MapSearch
          googleApiKey={googleApiKey}
          googleMapId={googleMapId}
          indicativeSearch={search}
          title={getStringOrDefault(component.fields["title"])}
          zoom={getNumberOrDefault(component.fields["zoom"])}
          centerEntity={getStringOrDefault(
            component.fields["center"],
            "27544008"
          )}
        />
      ) : (
        ""
      )}
    </>
  );
};
