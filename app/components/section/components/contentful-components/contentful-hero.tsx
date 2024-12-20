import { HeroDynamic } from "../../hero/hero-dynamic";
import { ContentfulComponent } from "~/helpers/sdk/content/content-response";
import { getBooleanOrDefault, getStringOrDefault } from "../helpers/check";

export const ContentfulHero = ({
  component,
  apiUrl,
}: {
  component: ContentfulComponent;
  apiUrl: string;
}) => {
  return (
    <HeroDynamic
      apiUrl={apiUrl}
      title={`${getStringOrDefault(component.fields["title"])} ${
        component.fields["tripType"] === undefined
          ? "undefined"
          : component.fields["tripType"]
      }`}
      text={getStringOrDefault(component.fields["subtitle"])}
      showGradient={getBooleanOrDefault(component.fields["gradient"])}
      showOverlay={getBooleanOrDefault(component.fields["overlay"])}
      imageSearchTerm={getStringOrDefault(component.fields["imageSearchTerm"])}
      showFlightControls={getBooleanOrDefault(
        component.fields["flightControls"]
      )}
      showGallery={getBooleanOrDefault(component.fields["gallery"])}
      fullHeight={getBooleanOrDefault(component.fields["fullHeight"])}
    />
  );
};
