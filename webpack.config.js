const path = require("path");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

// module.exports = {
//   entry: "./src/app.js",
//   output: {
//     filename: "bundle.js",
//     path: path.resolve(__dirname, "/dist"),
//     publicPath: "dist",
//   },
// };

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    home: ["./src/app.js", "./src/css/style.scss"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "/dist"),
    publicPath: "dist",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
};
