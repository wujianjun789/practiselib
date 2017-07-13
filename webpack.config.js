var path = require('path')
var webpack = require('webpack')
var HtmlwebpackPlugin = require('html-webpack-plugin');
var entry = {
    app: ['babel-polyfill', 'webpack-hot-middleware/client', './app/src/root/index']
};

module.exports = {
    // Enable sourcemaps for debugging webpack's output.
    devtool: 'eval-source-map',
    entry: entry,
    output: {
        path: path.join(__dirname, 'app', 'public'),
        filename: '[name].bundle.js',
        publicPath: '/',
        chunkFilename: '[name].[chunkhash].chunk.js',
    },
    plugins: [

        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
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
                test: /\.jsx?$/, loader: "babel-loader?presets[]=es2015&presets[]=react&presets[]=react-hmre",
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.less$/, loader: "style-loader!css-loader!less-loader"
            },

        ]

    }

};