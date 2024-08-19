import type { Meta, StoryObj } from '@storybook/react';
 
import { Search } from './search.component';
 
const meta: Meta<typeof Search> = {
  title: 'Section/Search/Search',
  component: Search,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};