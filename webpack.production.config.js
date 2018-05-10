/* eslint-env node */
const path = require('path');

module.exports = {
    mode: 'production',
    target: 'web',
    node: {
        fs: 'empty'
    },
    entry: './src/jepub.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jepub.js',
        library: 'jEpub',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.js', '.ejs']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(xml|html|css|ejs)$/,
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
    }
};
