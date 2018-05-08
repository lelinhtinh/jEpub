/* eslint-env node */
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    node: {
        fs: 'empty'
    },
    entry: './src/jepub.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jepub.js'
    },
    devtool: 'source-map',
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3333,
            server: {
                baseDir: ['demo', 'dist']
            },
            files: ['demo', 'dist']
        })
    ]
};
