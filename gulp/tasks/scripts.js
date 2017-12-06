const gulp = require("gulp"),
      webpack = require("webpack");

gulp.task("scripts", function(cb) {
    webpack(require("../../webpack.config.js"), function() {
        console.log("Webpack completed!");
        cb();
    })
});