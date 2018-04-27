import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"

// Production Flag.
const isProduction = process.env.NODE_ENV === "production"

// Global Configuration.
const configUrl = isProduction ? "src/app/config/config.js" : "src/app/config/config.dev.js"

// Import config file to use it in build process.
const config = require("./" + configUrl).default

const analytics = id => `
  <script async src="https://www.google-analytics.com/analytics.js"></script>
  <script>
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga("create", "${id}", "auto");
    ga("require", "urlChangeTracker");
    ga("send", "pageview");
  </script>
`

// ------------------------------------------------
// ---- Main Webpack Configuration ----------------
// ------------------------------------------------

export default() => ({

  entry: {
    app:"./app/index.js"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProduction ? "app/[chunkhash].js" : "[name].js"
  },

  context: path.resolve(__dirname, "src"),

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        }]
      }
    ]
  },

  resolve: {
    modules: [
      "shared", "node_modules"
    ],
    alias: {
      config: path.resolve(__dirname, configUrl),
      assets: path.resolve(__dirname, "src/app/assets"),
      package: path.resolve(__dirname, "./package.json")
    }
  },

  devServer: {
    hot: true,
    port: 8080,
    inline: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "dist")
  },

  optimization: {
    splitChunks: {
    	chunks: "all",
      name: true,
      minChunks: 1,
    	minSize: 30000,
    	maxAsyncRequests: 5,
    	maxInitialRequests: 3,
    	cacheGroups: {
    		default: {
    			minChunks: 2,
    			priority: -20,
    			reuseExistingChunk: true
    		},
    		vendors: {
    			test: /[\\/]node_modules[\\/]/,
          reuseExistingChunk: true,
          priority: -10
    		}
    	}
    },
    runtimeChunk: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      title: config.appname,
      filename: "index.html",
      basename: config.basename,
      analytics: config.analytics.on ? analytics(config.analytics.id) : "",
      template: path.resolve(__dirname, "src", "index.html")
    }),
    isProduction ? false : new webpack.HotModuleReplacementPlugin()
  ].filter(Boolean)
})
