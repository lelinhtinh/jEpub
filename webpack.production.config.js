/* eslint-env node */
const path = require('path');

const webpack = require('webpack');
const PACKAGE = require('./package.json');
const banner = `${PACKAGE.name} - ${PACKAGE.version} | (c) 2018 ${PACKAGE.author} | ${PACKAGE.license} | ${PACKAGE.homepage}`;

module.exports = {
    mode: 'production',
    target: 'web',
    node: {
        fs: 'empty'
    },
    entry: './src/jepub.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jepub.min.js',
        library: 'jEpub',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.js', '.ejs']
    },
    module: {
        rules: [
            {
                test: /[^.]|\.(xml|html|css|ejs)$/,
                include: [
                    path.resolve(__dirname, 'src/tpl')
                ],
                use: 'raw-loader'
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                exclude: [
                    path.resolve(__dirname, 'src/tpl')
                ],
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner)
    ]
};
