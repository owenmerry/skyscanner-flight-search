import { createElement } from "react";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { ContentfulComponent } from "~/helpers/sdk/content/content-response";
import { AllActivities } from "../activities/activities";
import { AllCountries } from "../page/explore";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

const getComponent = (component: ContentfulComponent) => {
  // component does exist
  const componentType = component.sys.contentType.sys.id;

  //hero
  if (componentType === "heroComponent") {
    return (
      <HeroSimple
        title={
          typeof component.fields["title"] === "string"
            ? component.fields["title"]
            : ""
        }
        text={
          typeof component.fields["subtitle"] === "string"
            ? component.fields["subtitle"]
            : ""
        }
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
        showAll
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

export const Components = ({ list }: { list: ContentfulComponent[] }) => {
  return <>{list.map((component) => getComponent(component))}</>;
};
