import type { Meta, StoryObj } from '@storybook/react';
 
import { GraphDrawer } from './drawer-graph';
import { getPlaceFromEntityId } from '~/helpers/sdk/place';
import moment from 'moment';
import { PriceGraph } from '../graph/price-graph';
 
const meta: Meta<typeof GraphDrawer> = {
  title: 'UI/Drawer/GraphDrawer',
  component: GraphDrawer,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

const query = {
  from: getPlaceFromEntityId("27544008"),
  to: getPlaceFromEntityId("27540823"),
  depart: moment().add(2, "days").format("YYYY-MM-DD"),
  return: moment().add(5, "days").format("YYYY-MM-DD"),
};

export const Default: Story = {
  args: {
    children: (query.from && query.to ? (<PriceGraph
      apiUrl={'https://api.flights.owenmerry.com'}
      query={{
        from: query.from,
        to: query.to,
        depart: query.depart,
        return: query.return,
      }}
      showReturn
    />) : (<></>))
  },
};