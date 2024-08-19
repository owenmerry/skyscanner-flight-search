import type { Meta, StoryObj } from '@storybook/react';
 
import { Location } from './location.component';
 
const meta: Meta<typeof Location> = {
  title: 'UI/Location',
  component: Location,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiUrl: "https://api.flights.owenmerry.com"
  },
};