import type { Meta, StoryObj } from '@storybook/react';
 
import { GameJackpot } from './game-jackpot';
 
const meta: Meta<typeof GameJackpot> = {
  title: 'Section/Game/GameJackpot',
  component: GameJackpot,
};
 
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiUrl: 'https://api.flights.owenmerry.com'
  },
};