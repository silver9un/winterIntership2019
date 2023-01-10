const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const hotMiddlewareScript =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true"

module.exports = {
  mode: "development",
  entry: {
    app: ["./public/print.js", hotMiddlewareScript]
  },
  devtool: "inline-source-map",
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  }
};
