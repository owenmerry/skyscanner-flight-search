import type { Meta, StoryObj } from '@storybook/react';
 
import { Loading } from './loading.component';
 
const meta: Meta<typeof Loading> = {
  title: 'UI/Loading/Loading',
  component: Loading,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};