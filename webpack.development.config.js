/* eslint-env node */
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    entry: './src/jepub.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jepub.js',
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
    devtool: 'source-map',
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
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3333,
            server: {
                baseDir: ['demo', 'dist', 'node_modules/jszip/dist', 'node_modules/ejs']
            },
            files: ['demo', 'dist'],
            index: '_index.html'
        })
    ]
};
