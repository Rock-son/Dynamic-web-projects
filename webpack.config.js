const path = require("path");

module.exports = {
    entry: {
        main: path.resolve(__dirname, "./public/assets/scripts/main.js"),
        vendor: path.resolve(__dirname, "./public/assets/scripts/vendor.js")
    },
    output: {
        path: path.resolve(__dirname, "./public/dist"),
        filename: "[name][chunkhash].js"
    },
    module: {
        rules: [
            {            
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/	        
            }
        ]
    }
}