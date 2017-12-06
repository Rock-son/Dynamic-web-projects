const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "./public/assets/scripts/main.js"),
    output: {
        path: path.resolve(__dirname, "./public/dist"),
        filename: "main.js"
    }
}