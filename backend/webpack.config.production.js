const path = require("path")
const webpack = require("webpack")
const CleanWebpackPlugin = require("clean-webpack-plugin") //빌드시 기존의 dist 파일 삭제
const nodeExternals = require("webpack-node-externals") //Server-side webpack 사용

module.exports = {
  mode: "production",
  entry: {
    server: ["./src/server.js"]
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2" //Server-Side 웹팩 사용
  },
  module: {
    rules: [
      {
        //eslint 사용
        //test: /\.js$/,
        //exclude: /(node_modules)/,
        //use: ["eslint-loader"]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  plugins: [new CleanWebpackPlugin(["dist"])],
  //Server-Side 웹팩 사용
  target: "node",
  externals: [
    nodeExternals({
      whitelist: ["jquery", "webpack/hot/dev-server", /^lodash/]
    })
  ],
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
    global: true
  }
}
