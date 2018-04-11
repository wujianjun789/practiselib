const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const iconUrl = '/font/font_zck90zmlh7hf47vi';
const theme = {'@icon-url':`"${iconUrl}"`};

module.exports = {
  entry: path.resolve(__dirname, 'app/src/root/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist', 'app', 'public'),
    filename: '[name].bundle.js',
    publicPath: '/',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: /\.css|\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
            'postcss-loader',
            {
              loader:'less-loader',
              options:{
                modifyVars:theme,
              },
            },
          ],
        }),
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test:/\.(png|jpe?g|gif|)$/,
        loader:'url-loader',
      },
    ],

  },
  plugins: [
    new webpack.BannerPlugin('starriver_pro V0.9'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.js',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new HtmlwebpackPlugin({
      filename: 'index.html',
      template: 'app/src/templates/index.html',
      inject: true,
      hash: true,
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false,

        },
        warnings: false,
      },
    }),
    new ExtractTextPlugin('styles.css'),
  ],
};
