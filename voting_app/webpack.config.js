const path = require("path");

module.exports = {
    entry: {
        createPoll: path.resolve(__dirname, "./public/assets/scripts/createPoll.js")
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
    }
}