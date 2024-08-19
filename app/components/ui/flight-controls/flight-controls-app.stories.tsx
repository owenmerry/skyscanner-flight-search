import type { Meta, StoryObj } from '@storybook/react';
 
import { FlightControlsApp } from './flight-controls-app';
 
const meta: Meta<typeof FlightControlsApp> = {
  title: 'UI/FlightControls/FlightControlsApp',
  component: FlightControlsApp,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};