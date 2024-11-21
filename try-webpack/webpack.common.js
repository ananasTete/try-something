const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Production',
        }),
    ],
    output: {
        filename: 'index.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [{
            test: '/\.less$/',
            use: [
                {
                    loader: path.resolve('./loader/style-loader.js'),
                },
                {
                    loader: path.resolve('./loader/less-loader.js'),
                }
            ] 
        }]
    }
};