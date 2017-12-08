const gulp = require("gulp"),
      webpack = require("webpack");

gulp.task("scripts", ["modernizr"], function(cb) {
    webpack(require("../../webpack.config.js"), function(err, stats) {
        if (err) {
            console.log(err.toString());
        }
        console.log(stats.toString());
        cb();
    })
});

gulp.task("scriptsVoting", ["modernizrVoting"], function(cb) {
    webpack(require("../../voting_app/webpack.config.js"), function(err, stats) {
        if (err) {
            console.log(err.toString());
        }
        console.log(stats.toString());
        cb();
    })
});