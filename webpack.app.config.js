var path = require('path')
var webpack = require('webpack')
var HtmlwebpackPlugin = require('html-webpack-plugin');
var entry = {
    app: ['babel-polyfill', './app/src/root']
};

module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist', 'app', 'public'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,  // remove all comments
            },
            compress: {
                warnings: false
            }
        }),
        new HtmlwebpackPlugin({
            filename: 'index.html',
            template: 'app/src/templates/index.html',
            inject: true,
            hash: true
        })
    ],


    resolve: {
        extensions: ["", ".js", ".jsx"]
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/, loader: "babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.less$/, loader: "style-loader!css-loader!less-loader"
            }
        ]

    }

};