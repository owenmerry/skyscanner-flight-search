import { AllCountries } from "../../page/explore";
import { ContentfulComponent } from "~/helpers/sdk/content/content-response";
import { getBooleanOrDefault } from "../helpers/check";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { useState } from "react";

export const ContentfulCountries = ({
  component,
  apiUrl,
}: {
  component: ContentfulComponent;
  apiUrl: string;
}) => {
  const placesSDK = skyscanner().geo();
  const [countryShow, setCountryShow] = useState(
    getBooleanOrDefault(component.fields["showAll"])
  );

  return (
    <AllCountries
      countries={placesSDK.countries}
      showAll={countryShow}
      onShowToggle={() => {
        setCountryShow(!countryShow);
      }}
    />
  );
};
