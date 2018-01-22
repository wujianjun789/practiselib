const webpack = require('webpack');
const configReg = /^.*\.\/config$/;
const configFile = './config';
module.exports = {
    entry: './server/server.js',
    output: {
        libraryTarget: 'commonjs',
        filename: 'index.js'
    },
    externals: [
        /^[a-z0-9_-]+$/, configFile,
        function (context, request, callback) {
            //'../config->./config'
            if (configReg.test(request)) {
                return callback(null, configFile);
            }
            callback();
        }
    ],
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ],
    node: {
        __dirname: true
    },
    target: 'node'
};