/* eslint-env node */
const path = require('path');

const webpack = require('webpack');
const PACKAGE = require('./package.json');
const banner = `${PACKAGE.name} - ${PACKAGE.version} | (c) 2018 ${PACKAGE.author} | ${PACKAGE.license} | ${PACKAGE.homepage}`;

module.exports = {
    mode: 'production',
    target: 'web',
    entry: './src/jepub.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jepub.min.js',
        library: 'jEpub',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.js', '.ejs'],
        fallback: {
          fs: false
        }
    },
    module: {
        rules: [
            {
                test: /[^.]|\.(xml|html|css)$/,
                include: [
                    path.resolve(__dirname, 'src/tpl')
                ],
                use: 'raw-loader',
            },
            {
                test: /[^.]|\.ejs$/,
                include: [
                    path.resolve(__dirname, 'src/tpl')
                ],
                use: path.resolve(__dirname, 'minify-ejs.js'),
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
