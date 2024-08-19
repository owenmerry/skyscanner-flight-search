import type { Meta, StoryObj } from '@storybook/react';
 
import { FooterDefault } from './footer-default';
 
const meta: Meta<typeof FooterDefault> = {
  title: 'UI/Footer/FooterDefault',
  component: FooterDefault,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};