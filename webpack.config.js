const path = require("path"),      
      webpack = require("webpack"),
      UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, "./public/assets/scripts/main.js"),
        vendor: path.resolve(__dirname, "./public/assets/scripts/vendor.js")
    },
    output: {
        path: path.resolve(__dirname, "./public/dist"),
        filename: "[name]_[chunkhash].js"
    },
    module: {
        rules: [
            {            
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/	        
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
}