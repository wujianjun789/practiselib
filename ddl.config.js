/**
 * Created by a on 2017/11/27.
 */
var path = require('path');
const webpack = require('webpack');

const vendors = [
    'cookie-parser',
    'es6-promise',
    'identity-obj-proxy',
    'isomorphic-fetch',
    'lodash',
    'moment',
    'morgan',
    'rc-pagination',
    'react-color',
    'react-datepicker',
    'react-fontawesome',
    'react-treebeard',
    'antd',
    'babel-cli',
    'babel-plugin-import',
    'babel-polyfill',
    'babel-preset-react',
    'babel-preset-react-hmre',
    'gulp-rename',
    'immutable',
    'pump',
    'react',
    'react-addons-css-transition-group',
    'react-addons-test-utils',
    'react-dom',
    'react-intl',
    'react-intl-redux',
    'react-motion',
    'react-redux',
    'react-router',
    'react-router-redux',
    'react-test-renderer',
    'redux',
    'redux-auth-wrapper',
    'redux-mock-store',
    'redux-thunk'
];

module.exports = {
    output: {
        path: path.join(__dirname, 'app/public/lib'),
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        'lib': vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname
        })
    ]
};