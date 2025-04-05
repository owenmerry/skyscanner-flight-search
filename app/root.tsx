import { withSentry } from "@sentry/remix";
import * as amplitude from "@amplitude/analytics-browser";
import {
  type LinksFunction,
  redirect,
  type V2_MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useNavigate
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";

//mui
import { withEmotionCache } from "@emotion/react";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material";
import ClientStyleContext from "./src/ClientStyleContext";
import Layout from "./src/Layout";
import { useContext, useEffect } from "react";
interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

export const meta: V2_MetaFunction = () => ([{
  title: "Flight Search App",
},
{ charSet: "utf-8" },
{ name: "viewport", content: "width=device-width, user-scalable=no, maximum-scale=1.0, initial-scale=1.0, minimum-scale=1.0" },
    ]);


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <meta name="theme-color" content="#101827" />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          ></link>

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
);

const isMaintenanceMode = false;

export let loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);

  // Redirect all routes to maintenance page except for the maintenance route itself
  if (isMaintenanceMode && url.pathname !== "/maintenance") {
    return redirect("/maintenance");
  }

  // Pass `isMaintenanceMode` down to the client
  return { isMaintenanceMode };
};

function App() {
  const { isMaintenanceMode } = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    amplitude.init("db590d6781718f23151b150759366db4", {
      defaultTracking: true,
    });
  }, []);

  useEffect(() => {
    if (isMaintenanceMode && location.pathname !== "/maintenance") {
      navigate("/maintenance", { replace: true });
    }
  }, [isMaintenanceMode, location.pathname, navigate]);

  if(isMaintenanceMode) return <Document>
      <Layout>Maintenance Mode</Layout></Document>;

  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export default withSentry(App);