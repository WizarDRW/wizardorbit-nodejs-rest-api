var { DefinePlugin } = require('webpack');
var dotenv = require('dotenv');
var path = require('path');
var fs = require('fs');
var nodeModules = {};

const HtmlWebpackPlugin = require("html-webpack-plugin")

fs.readdirSync(path.resolve(__dirname, 'node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });
console.log(path.resolve(__dirname, 'dist'));
const {
    NODE_ENV = 'production',
} = process.env;
module.exports = {
    name: 'server',
    entry: './src/server.js',
    mode: NODE_ENV,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: '[name].[hash:8].bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    optimization: {
        splitChunks: {
            minSize: 10000,
            maxSize: 250000,
        },
        runtimeChunk: 'single',
    },
    externals: nodeModules,
    plugins: [
        new DefinePlugin({
            "process.env": JSON.stringify(dotenv.config().parsed)
        }),
        new HtmlWebpackPlugin({
            template: 'ejs-webpack-loader!src/views/login.ejs',
            filename: 'index.html',
            domain: '.sihirbazforum.com'
        })
    ]
}