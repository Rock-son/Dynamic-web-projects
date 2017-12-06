const gulp = require("gulp"),
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