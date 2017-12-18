const path = require('path')
const webpack = require('webpack')
const HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'app/src/root/index.js'),
    output: {
        path: path.resolve(__dirname, 'app', 'public'),
        filename: '[name].bundle.js',
        publicPath: '/',
        chunkFilename: '[name].[chunkhash].chunk.js',
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'app/public'),
        historyApiFallback: true,
        inline: true,
        hot: true,
        host: '0.0.0.0',
        port: 18080
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                include: __dirname,

            },
            {
                test: /\.css|\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                        }
                    }
                ],
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./manifest.json'),
        }),
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
        }),
    ],
};