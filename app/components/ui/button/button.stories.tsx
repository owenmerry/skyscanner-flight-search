import type { Meta, StoryObj } from '@storybook/react';
 
import { Button } from './button';
 
const meta: Meta<typeof Button> = {
  title: 'UI/Button/Button',
  component: Button,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Button'
  },
};

export const Secondary: Story = {
  args: {
    text: 'Button',
    secondary: true,
  },
};
