import { AllCountries } from "../../page/explore";
import { ContentfulComponent } from "~/helpers/sdk/content/content-response";
import { getBooleanOrDefault, getStringOrDefault } from "../helpers/check";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { useEffect, useState } from "react";
import { MapSearch } from "../../map-search/map-search";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";

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
  });

  const runIndicative = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: getStringOrDefault(component.fields["from"]),
        to: getStringOrDefault(component.fields["to"], "anywhere"),
        depart: "2023-12-01",
        return: "2023-12-20",
        tripType: "return",
      },
      month: Number("2023-12-01".split("-")[1]),
    });

    if ("error" in indicativeSearch.search) return;

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
        />
      ) : (
        ""
      )}
    </>
  );
};
