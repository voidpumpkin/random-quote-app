const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    devServer: {
        publicPath: '/dist',
        contentBase: path.resolve(__dirname, 'src'),
        watchContentBase: true
    }
};