import type { Preview } from "@storybook/react";
import '../storybook-build/tailwind.css'

import { ThemeProvider, CssBaseline } from '@mui/material';
import { withThemeByClassName, withThemeFromJSXProvider } from '@storybook/addon-themes';
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router';

/* TODO: update import for your custom Material UI themes */
import theme from '../app/src/theme';

const preview: Preview = {
  decorators: [withRouter, withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  })],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { userId: '42' },
        searchParams: { tab: 'activityLog' },
        state: { fromPage: 'homePage' },
      },
      routing: {
        path: '/users/:userId',
        handle: 'Profile',
      },
    }),
  },
  tags: ['autodocs'],
};

export default preview;
