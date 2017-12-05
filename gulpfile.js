const gulp = require("gulp"),
      watch = require("gulp-watch"),
      postcss = require("gulp-postcss"),
      autoprefixer = require("autoprefixer"),
      sass = require("gulp-sass"),
      // OUTPUT DIRs
      homeOutputPath = "./public/assets/styles/",
      votingOutputPath = "./voting_app/public/assets/styles/",
      // STARTING DIRs
      homeStylePath = homeOutputPath + "scss/home/",
      registerStylePath = homeOutputPath + "scss/register/",
      votingAppStylePath = votingOutputPath + "scss/";

gulp.task('start', ['watch']);

// TRANSFORM SCSS TO CSS
gulp.task("homePageStyles", function() {    
    return gulp.src(homeStylePath + "index.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer])) // order matters - FIFO (first in, first out)        
        .pipe(gulp.dest(homeOutputPath));
});
gulp.task("registerPageStyles", function() {    
    return gulp.src(registerStylePath + "register.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer])) // order matters - FIFO (first in, first out)
        .pipe(gulp.dest(homeOutputPath));
});
gulp.task("votingPageStyles", function() {    
    return gulp.src(votingAppStylePath + "index.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer ])) // order matters - FIFO (first in, first out)
        .pipe(gulp.dest(votingOutputPath));
});

// WATCH
gulp.task("watch", function() {
    
    watch(homeStylePath + "*.scss", () => gulp.start("homePageStyles"));
    watch(homeOutputPath + "**/*.scss", () => gulp.start("homePageStyles", "registerPageStyles"));
    watch("./public/assets/shared/*.scss", () => gulp.start(["homePageStyles", "votingPageStyles", "registerPageStyles"]));
    watch(votingAppStylePath + "**/*.scss", () => gulp.start("votingPageStyles"));    
});


// e.g.  watch(votingAppStylePath + "**/*.scss", () => gulp.start("votingPageStyles"));