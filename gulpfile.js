const gulp = require("gulp"),
      watch = require("gulp-watch"),
      postcss = require("gulp-postcss"),
      autoprefixer = require("autoprefixer"),
      sass = require("gulp-sass"),
      mainStylesPath = "./public/assets/styles/",
      votingAppStylePath = "./voting_app/public/assets/styles";
      

gulp.task("default", function() {
  
  console.log("Hooray - you created a gulp task!");  
});


// HTML
gulp.task("html", function() {
 
});


// SCSS
gulp.task("homePageStyles", function() {
    
    return gulp.src(mainStylesPath + "/scss/main.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer])) // order matters - FIFO (first in, first out)
        .pipe(gulp.dest(mainStylesPath));
});

gulp.task("votingPageStyles", function() {
    
    return gulp.src(votingAppStylePath + "/scss/main.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer])) // order matters - FIFO (first in, first out)
        .pipe(gulp.dest(votingAppStylePath));
});


// WATCH
gulp.task("watch", function() {

    watch("./views/index.pug", function() {
        gulp.start("html");
    });
    watch(mainStylesPath + "**/*.scss", function() {
        gulp.start("homePageStyles");
    });
    watch(votingAppStylePath + "**/*.scss", function() {
        gulp.start("votingPageStyles");
    });
});
