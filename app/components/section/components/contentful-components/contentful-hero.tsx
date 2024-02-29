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
      title={getStringOrDefault(component.fields["title"])}
      text={getStringOrDefault(component.fields["subtitle"])}
      showGradient={getBooleanOrDefault(component.fields["gradient"])}
      showOverlay={getBooleanOrDefault(component.fields["overlay"])}
      imageSearchTerm={getStringOrDefault(component.fields["imageSearchTerm"])}
      showFlightControls={getBooleanOrDefault(
        component.fields["flightControls"]
      )}
    />
  );
};
