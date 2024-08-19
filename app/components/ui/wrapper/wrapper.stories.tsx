import type { Meta, StoryObj } from '@storybook/react';
 
import { Wrapper } from './wrapper.component';
 
const meta: Meta<typeof Wrapper> = {
  title: 'UI/Wrapper',
  component: Wrapper,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};