import type { Meta, StoryObj } from '@storybook/react';
 
import { NavSidebar } from './header-sidebar';
 
const meta: Meta<typeof NavSidebar> = {
  title: 'UI/Header/NavSidebar',
  component: NavSidebar,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};