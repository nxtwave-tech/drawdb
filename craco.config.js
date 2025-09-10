const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: "drawdb",
          filename: "remoteEntry.js",
          exposes: {
            "./Editor": "./src/remoteEntry.js",
          },
          shared: {
            react: {
              singleton: true,
              requiredVersion: "^17.0.2",
              eager: true,
            },
            "react-dom": {
              singleton: true,
              requiredVersion: "^17.0.2",
              eager: true,
            },
          },
        })
      );

      webpackConfig.output.publicPath = "auto";

      if (process.env.NODE_ENV === "production") {
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            ...webpackConfig.optimization.splitChunks,
            chunks: "async",
          },
        };
      }

      return webpackConfig;
    },
  },
};
