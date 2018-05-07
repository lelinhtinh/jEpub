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
        filename: 'jepub.js'
    }
};
