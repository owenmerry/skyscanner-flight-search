import type { Meta, StoryObj } from '@storybook/react';
 
import { HeaderDefault } from './header-default';
 
const meta: Meta<typeof HeaderDefault> = {
  title: 'UI/Header/HeaderDefault',
  component: HeaderDefault,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};