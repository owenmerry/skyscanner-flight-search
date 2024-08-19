import type { Meta, StoryObj } from '@storybook/react';
 
import { HeroDefault } from './hero-default';
 
const meta: Meta<typeof HeroDefault> = {
  title: 'Section/Hero/HeroDefault',
  component: HeroDefault,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};