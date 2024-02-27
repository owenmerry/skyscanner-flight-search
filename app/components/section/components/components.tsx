import { createElement } from "react";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { ContentfulComponent } from "~/helpers/sdk/content/content-response";
import { AllActivities } from "../activities/activities";
import { AllCountries } from "../page/explore";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { getBooleanOrDefault, getStringOrDefault } from "./helpers/check";
import { HeroDynamic } from "../hero/hero-dynamic";

const getComponent = (component: ContentfulComponent, apiUrl: string) => {
  // component does exist
  const componentType = component.sys.contentType.sys.id;

  //hero
  if (componentType === "heroComponent") {
    return (
      <HeroDynamic
        apiUrl={apiUrl}
        title={getStringOrDefault(component.fields["title"])}
        text={getStringOrDefault(component.fields["subtitle"])}
        showGradient={getBooleanOrDefault(component.fields["gradient"])}
        showOverlay={getBooleanOrDefault(component.fields["overlay"])}
        imageSearchTerm={getStringOrDefault(
          component.fields["imageSearchTerm"]
        )}
      />
    );
  }

  //activities
  if (componentType === "activitiesComponent") {
    return <AllActivities />;
  }

  //countries
  if (componentType === "countriesComponent") {
    const placesSDK = skyscanner().geo();

    return (
      <AllCountries
        countries={placesSDK.countries}
        showAll={getBooleanOrDefault(component.fields["showAll"])}
        onShowToggle={() => {}}
      />
    );
  }

  // component doesn't exist yet
  return createElement(
    () => <div>The component {componentType} has not been created yet.</div>,
    { key: component.sys.id }
  );
};

export const Components = ({
  apiUrl,
  list,
}: {
  apiUrl: string;
  list: ContentfulComponent[];
}) => {
  return <>{list.map((component) => getComponent(component, apiUrl))}</>;
};
