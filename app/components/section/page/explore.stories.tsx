import type { Meta, StoryObj } from "@storybook/react";

import { AllCountries } from "./explore";
import { skyscanner } from "../../../../app/helpers/sdk/skyscannerSDK";

const meta: Meta<typeof AllCountries> = {
  title: "Section/Page/AllCountries",
  component: AllCountries,
};

export default meta;

type Story = StoryObj<typeof meta>;

const countries = skyscanner().geo().countries;

export const Default: Story = {
  args: {
    countries,
    showAll: true,
  },
};
