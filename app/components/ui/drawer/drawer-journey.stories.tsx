import type { Meta, StoryObj } from '@storybook/react';
 
import { JourneyDrawer } from './drawer-journey';
 
const meta: Meta<typeof JourneyDrawer> = {
  title: 'UI/Drawer/JourneyDrawer',
  component: JourneyDrawer,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: [<div key='key'>Show Journey</div>]
  },
};