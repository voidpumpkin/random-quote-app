const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true
    },
    module: {
        rules: [{
            test: /\.html$/,
            use: ['html-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};