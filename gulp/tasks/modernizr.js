const gulp = require("gulp"),
      modernizr = require("gulp-modernizr");

gulp.task("modernizr", function() {
    return gulp.src(["./public/dist/*.css", "./public/dist/*.js"])
        .pipe(modernizr({
            "options": [
                "setClasses"
            ]
        }))
        .pipe(gulp.dest("./public/assets/scripts/modules/"));
});

gulp.task("modernizrVoting", function() {
    return gulp.src(["./voting_app/public/dist/*.css", "./voting_app/public/dist/*.js"])
        .pipe(modernizr({
            "options": [
                "setClasses"
            ]
        }))
        .pipe(gulp.dest("./voting_app/public/assets/scripts/modules/"));
});