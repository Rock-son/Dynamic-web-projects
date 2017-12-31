const gulp = require("gulp"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    sass = require("gulp-sass"),
    // STARTING DIRs
    mainPath = "/public/assets/styles/partial/",
    homeStylePath = "." + mainPath + "home/",
    registerStylePath = "." + mainPath + "register/",
    votingAppStylePath = "./voting_app" + mainPath;


// TRANSFORM SCSS TO CSS
gulp.task("homePageStyles", function() {    
    return gulp.src(homeStylePath + "index.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer])) // order matters - FIFO (first in, first out)        
        .pipe(gulp.dest("./public/dist/"));
});
gulp.task("registerPageStyles", function() {    
    return gulp.src(registerStylePath + "register.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer])) // order matters - FIFO (first in, first out)
        .pipe(gulp.dest("./public/dist/"));
});
gulp.task("votingHomeStyles", function() {    
    return gulp.src(votingAppStylePath + "/homePage/homePage.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer ])) // order matters - FIFO (first in, first out)
        .pipe(gulp.dest("./voting_app/public/dist"));
});
gulp.task("votingCreatePollStyles", function() {    
    return gulp.src(votingAppStylePath + "/createPoll/createPoll.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer ])) // order matters - FIFO (first in, first out)
        .pipe(gulp.dest("./voting_app/public/dist"));
});

gulp.task("styles", ["homePageStyles", "registerPageStyles", "votingHomeStyles", "votingNewPollStyles"]);