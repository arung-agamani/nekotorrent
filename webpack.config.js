const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlPlugin = new HtmlWebpackPlugin({
    template: './web/src/index.html'
});

const config = {
    mode: 'development',
    entry: './web/src/index.tsx',
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            }
        ]
    },
    plugins: [htmlPlugin]
}

module.exports = config