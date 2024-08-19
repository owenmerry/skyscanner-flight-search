import type { Meta, StoryObj } from '@storybook/react';
 
import { HeroSimple } from './hero-simple';
 
const meta: Meta<typeof HeroSimple> = {
  title: 'Section/Hero/HeroSimple',
  component: HeroSimple,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Hero Title",
    text: "Hero Text",
    backgroundImage: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?ixid=M3w0MjE3MjJ8MHwxfHNlYXJjaHwzfHxJcmVsYW5kfGVufDB8MHx8fDE2ODQzNjE2NTV8MA&ixlib=rb-4.0.3&w=1500"
  },
};