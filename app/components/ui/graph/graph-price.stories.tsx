import type { Meta, StoryObj } from "@storybook/react";

import { PriceGraph } from "./price-graph";
import { getPlaceFromEntityId } from "~/helpers/sdk/place";
import moment from "moment";

const meta: Meta<typeof PriceGraph> = {
  title: "UI/Graph/PriceGraph",
  component: PriceGraph,
};

export default meta;

type Story = StoryObj<typeof meta>;

const query = {
  from: getPlaceFromEntityId("27544008"),
  to: getPlaceFromEntityId("27540823"),
  depart: moment().add(2, "days").format("YYYY-MM-DD"),
};

export const Default: Story = {
  args: {
    apiUrl: "GameJackpot",
    ...(query.from && query.to ? {query: {
      from: query.from,
      to: query.to,
      depart: query.depart,
    }} : {}),
  },
};
