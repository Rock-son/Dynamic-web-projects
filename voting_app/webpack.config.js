const path = require("path");

module.exports = {
    entry: {
        main: path.resolve(__dirname, "./public/assets/scripts/main_voting.js")
    },
    output: {
        path: path.resolve(__dirname, "./public/dist"),
        filename: "[name].js"
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