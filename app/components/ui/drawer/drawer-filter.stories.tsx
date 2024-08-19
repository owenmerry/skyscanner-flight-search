import type { Meta, StoryObj } from '@storybook/react';
 
import { FiltersDrawer } from './drawer-filter';
import { FiltersDefault } from '../filters/filters-default';
 
const meta: Meta<typeof FiltersDrawer> = {
  title: 'UI/Drawer/FiltersDrawer',
  component: FiltersDrawer,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className='p-4'><FiltersDefault onFilterChange={() => {}} /></div>
  },
};