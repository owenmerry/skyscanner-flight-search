import type { Meta, StoryObj } from '@storybook/react';
 
import { FlightControls } from './flight-controls-default';
 
const meta: Meta<typeof FlightControls> = {
  title: 'UI/FlightControls/FlightControlsDefault',
  component: FlightControls,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};