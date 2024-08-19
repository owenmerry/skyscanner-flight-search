import type { Meta, StoryObj } from '@storybook/react';
 
import { NavigationWebsite } from './navigation-website';
 
const meta: Meta<typeof NavigationWebsite> = {
  title: 'UI/Navigation/NavigationWebsite',
  component: NavigationWebsite,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};