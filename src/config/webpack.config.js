const path = require("path");
const webpack = require("webpack");

module.exports = {
  resolve: {
    fallback: {
      url: require.resolve("url/"),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};
