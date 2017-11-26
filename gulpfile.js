const gulp = require("gulp"),
      watch = require("gulp-watch"),
      postcss = require("gulp-postcss"),
      autoprefixer = require("autoprefixer"),
      sass = require("gulp-sass"),
      mainStylePath = "./public/assets/styles/",
      votingAppStylePath = "./voting_app/public/assets/styles/",
      cleanCSS = require("gulp-clean-css");

      

// TRANSFORM SCSS
gulp.task("homePageStyles", function() {
    
    return gulp.src(mainStylePath + "scss/main.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer])) // order matters - FIFO (first in, first out)
        .pipe(gulp.dest(mainStylePath));
});
gulp.task("votingPageStyles", function() {
    
    return gulp.src(votingAppStylePath + "scss/main.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer ])) // order matters - FIFO (first in, first out)
        .pipe(gulp.dest(votingAppStylePath));
});
// MINIFY
gulp.task("minifyLandingCSS", function() {
    
    return gulp.src(mainStylePath + "main.css")
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("./public/dist" ));
});
gulp.task("minifyVotingAppCSS", function() {
    
    return gulp.src(votingAppStylePath + "main.css")
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("./voting_app/public/dist"));
});

// WATCH
gulp.task("watch", function() {

    watch(mainStylePath + "**/*.scss", () => gulp.start("homePageStyles"));
    watch(votingAppStylePath + "**/*.scss", () => gulp.start("votingPageStyles"));
    watch(mainStylePath + "main.css", () => gulp.start("minifyLandingCSS"));
    watch(votingAppStylePath + "main.css", () => gulp.start("minifyVotingAppCSS"));
    
});
