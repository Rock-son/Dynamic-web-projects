const gulp = require("gulp"),
      watch = require("gulp-watch"),
      postcss = require("gulp-postcss"),
      autoprefixer = require("autoprefixer"),
      sass = require("gulp-sass"),
      mainStylePath = "./public/assets/styles/",
      votingAppStylePath = "./voting_app/public/assets/styles/",
      cleanCSS = require("gulp-clean-css");

gulp.task('start', ['watch']);

// TRANSFORM SCSS
gulp.task("homePageStyles", function() {
    
    return gulp.src(mainStylePath + "scss/main.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer])) // order matters - FIFO (first in, first out)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(mainStylePath));
});
gulp.task("votingPageStyles", function() {
    
    return gulp.src(votingAppStylePath + "scss/main.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer ])) // order matters - FIFO (first in, first out)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(votingAppStylePath));
});

// WATCH
gulp.task("watch", function() {

    watch(mainStylePath + "**/*.scss", () => gulp.start("homePageStyles"));
    watch(votingAppStylePath + "**/*.scss", () => gulp.start("votingPageStyles"));    
});
