import { createElement, useState } from "react";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { ContentfulComponent } from "~/helpers/sdk/content/content-response";
import { AllActivities } from "../activities/activities";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { getBooleanOrDefault, getStringOrDefault } from "./helpers/check";
import { HeroDynamic } from "../hero/hero-dynamic";
import { ContentfulHero } from "./contentful-components/contentful-hero";
import { ContentfulCountries } from "./contentful-components/contentful-countries";
import { ContentfulMap } from "./contentful-components/contentful-map";

const getComponent = (
  component: ContentfulComponent,
  apiUrl: string,
  googleApiKey: string,
  googleMapId: string
) => {
  // component does exist
  const componentType = component.sys.contentType.sys.id;

  //hero
  if (componentType === "heroComponent") {
    return <ContentfulHero component={component} apiUrl={apiUrl} />;
  }

  //activities
  if (componentType === "activitiesComponent") {
    return <AllActivities />;
  }

  //countries
  if (componentType === "countriesComponent") {
    return <ContentfulCountries component={component} apiUrl={apiUrl} />;
  }

  //map
  if (componentType === "mapComponent") {
    return (
      <ContentfulMap
        component={component}
        apiUrl={apiUrl}
        googleApiKey={googleApiKey}
        googleMapId={googleMapId}
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
  googleApiKey,
  googleMapId,
}: {
  apiUrl: string;
  list: ContentfulComponent[];
  googleApiKey: string;
  googleMapId: string;
}) => {
  return (
    <>
      {list.map((component) =>
        getComponent(component, apiUrl, googleApiKey, googleMapId)
      )}
    </>
  );
};
