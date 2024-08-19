import type { Meta, StoryObj } from '@storybook/react';
 
import { Map } from './map.component';
 
const meta: Meta<typeof Map> = {
  title: 'UI/Map/Map',
  component: Map,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};