import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import { default as tsconfigPaths } from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  stories: [
    "../app/components/**/*.mdx",
    "../app/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
    "storybook-addon-remix-react-router",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        tsconfigPaths()
      ]
    })
  },
};

export default config;