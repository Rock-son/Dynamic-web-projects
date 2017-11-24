const gulp = require("gulp"),
      watch = require("gulp-watch"),
      postcss = require("gulp-postcss"),
      autoprefixer = require("autoprefixer"),
      sass = require("gulp-sass"),
      stylesPath = "./public/assets/styles/";
      

gulp.task("default", function() {
  
  console.log("Hooray - you created a gulp task!");  
});


// HTML
gulp.task("html", function() {
 
});


// SCSS
gulp.task("styles", function() {
    
    return gulp.src(stylesPath + "/scss/main.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer])) // order matters - FIFO (first in, first out)
        .pipe(gulp.dest(stylesPath));
});


// WATCH
gulp.task("watch", function() {

    watch("./views/index.pug", function() {
        gulp.start("html");
    });
    watch(stylesPath + "**/*.scss", function() {
        gulp.start("styles");
    });
});
