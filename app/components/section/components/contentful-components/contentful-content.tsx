import { ContentfulComponent } from "~/helpers/sdk/content/content-response";
import { ContentBlock } from "../../content-block/content-block";
import { getStringOrDefault } from "../helpers/check";

export const ContentfulContentBlock = ({
  component,
  apiUrl,
  slug,
}: {
  component: ContentfulComponent;
  apiUrl: string;
  slug: string;
}) => {
  return (
    <ContentBlock
      title={getStringOrDefault(component.fields["title"])}
      text1={getStringOrDefault(component.fields["text1"])}
      text2={getStringOrDefault(component.fields["text2"])}
      link={getStringOrDefault(component.fields["link"])}
    />
  );
};
