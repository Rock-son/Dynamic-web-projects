const gulp = require("gulp"),
      modernizr = require("gulp-modernizr");

gulp.task("modernizr", function() {
    return gulp.src(["./public/dist/*.css", "./public/dist/*.js"])
        .pipe(modernizr({
            "options": [
                "setClasses"
            ]
        }))
        .pipe(gulp.dest("./public/assets/scripts/"));
});