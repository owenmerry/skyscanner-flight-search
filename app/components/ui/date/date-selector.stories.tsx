import type { Meta, StoryObj } from '@storybook/react';
 
import { DateSelector } from './date-selector';
import { getDefualtFlightQuery} from '~/helpers/sdk/flight';
 
const meta: Meta<typeof DateSelector> = {
  title: 'UI/Date/DateSelector',
  component: DateSelector,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

const query = getDefualtFlightQuery();

export const Default: Story = {
  args: {
    query
  },
};