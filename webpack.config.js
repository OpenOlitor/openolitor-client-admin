var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var optimization = {
  splitChunks: {
    cacheGroups: {
      node_vendors: {
        test: /[\\/]node_modules[\\/]/,
        chunks: "async",
        priority: 1
      }
    }
  }
}

module.exports = {
  //devtool: 'source-map',
  mode: 'development',
  entry: {
    app: './scripts/app.js',
    vendor: ['angular']
  },
  context: __dirname + '/app',
  //module: {
  //  loaders: [
  //     { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel' },
  //     { test: /\.html$/, loader: 'raw' },
  //     { test: /\.(scss|sass)$/, loader: 'style!css!sass' },
  //     { test: /\.css$/, loader: 'style!css' }
  //  ]
  //},
  output: {
    path: __dirname + '/js',
    filename: '[name].bundle.js'
  },
  optimization: optimization,
  plugins: [
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    //new HtmlWebpackPlugin({
    //  template: 'client/index.html',
    //  inject: 'body',
    //  hash: true
    //}),
    new webpack.DefinePlugin({
      angular: 'angular',
    })

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    //new webpack.optimize.CommonsChunkPlugin({
    //  name: 'vendor',
    //  minChunks: function (module, count) {
    //    return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
    //  }
    //})
  ]
};