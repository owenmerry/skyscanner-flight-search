import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Flight Search App',
  viewport: 'width=device-width, user-scalable=no, maximum-scale=1.0, initial-scale=1.0, minimum-scale=1.0',
});

export default function App() {
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
