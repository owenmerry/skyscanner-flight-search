import type { Meta, StoryObj } from '@storybook/react';
 
import { FiltersDefault } from './filters-default';
 
const meta: Meta<typeof FiltersDefault> = {
  title: 'UI/FiltersDefault',
  component: FiltersDefault,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};