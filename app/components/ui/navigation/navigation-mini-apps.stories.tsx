import type { Meta, StoryObj } from '@storybook/react';
 
import { NavigationMiniApps } from './navigation-mini-apps';
 
const meta: Meta<typeof NavigationMiniApps> = {
  title: 'UI/Navigation/NavigationMiniApps',
  component: NavigationMiniApps,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};