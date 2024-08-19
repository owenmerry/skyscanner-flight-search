import type { Meta, StoryObj } from '@storybook/react';
 
import Calender from './calender';
import moment from 'moment';
 
const meta: Meta<typeof Calender> = {
  title: 'UI/Calender/Calender',
  component: Calender,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    displayDate: moment().format('YYYY-MM-DD'),
    selectedDate: moment().format('YYYY-MM-DD'),
    departDate: moment().add(7, 'days').format('YYYY-MM-DD'),
    returnDate: moment().add(10, 'days').format('YYYY-MM-DD'),
  },
};

export const SameDay: Story = {
  args: {
    displayDate: moment().format('YYYY-MM-DD'),
    selectedDate: moment().format('YYYY-MM-DD'),
    departDate: moment().add(10, 'days').format('YYYY-MM-DD'),
    returnDate: moment().add(10, 'days').format('YYYY-MM-DD'),
  },
};

export const Month: Story = {
  args: {
    displayDate: moment().format('YYYY-MM-DD'),
    selectedDate: moment().format('YYYY-MM-DD'),
    departDate: moment().add(0, 'months').format('YYYY-MM-DD'),
    returnDate: moment().add(1, 'months').format('YYYY-MM-DD'),
  },
};