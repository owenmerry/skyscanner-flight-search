import type { Meta, StoryObj } from '@storybook/react';
 
import { LocationPlaces } from './location-places.component';
 
const meta: Meta<typeof LocationPlaces> = {
  title: 'UI/Location/LocationPlaces',
  component: LocationPlaces,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiUrl: "https://api.flights.owenmerry.com"
  },
};