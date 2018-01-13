const path = require("path"),
      webpack = require("webpack"),
      UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        createPoll: path.resolve(__dirname, "./public/assets/scripts/createPoll.js")
    },
    output: {
        path: path.resolve(__dirname, "./public/dist"),
        filename: "[name]_[chunkhash].min.js"
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