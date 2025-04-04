/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  future: {
    unstable_tailwind: true,
    v2_meta: true,
  },
  routes(defineRoutes) {
    return defineRoutes((route) => {
      route("pages/*", "routes/pages/dynamic-route.tsx");
    });
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
