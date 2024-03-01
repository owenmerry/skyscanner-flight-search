import { createElement, useState } from "react";
import { ContentfulComponent } from "~/helpers/sdk/content/content-response";
import { AllActivities } from "../activities/activities";
import { ContentfulHero } from "./contentful-components/contentful-hero";
import { ContentfulCountries } from "./contentful-components/contentful-countries";
import { ContentfulMap } from "./contentful-components/contentful-map";
import { ContentfulContentBlock } from "./contentful-components/contentful-content";

const getComponent = (
  component: ContentfulComponent,
  apiUrl: string,
  slug: string,
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

  //content
  if (componentType === "contentComponent") {
    return (
      <ContentfulContentBlock
        component={component}
        apiUrl={apiUrl}
        slug={slug}
      />
    );
  }

  // component doesn't exist yet
  return createElement(
    () => (
      <div className="text-center">
        The component {componentType} has not been created yet.
      </div>
    ),
    { key: component.sys.id }
  );
};

export const Components = ({
  apiUrl,
  list,
  googleApiKey,
  googleMapId,
  slug,
}: {
  apiUrl: string;
  list: ContentfulComponent[];
  googleApiKey: string;
  googleMapId: string;
  slug: string;
}) => {
  return (
    <>
      {list.map((component) =>
        getComponent(component, apiUrl, slug, googleApiKey, googleMapId)
      )}
    </>
  );
};
