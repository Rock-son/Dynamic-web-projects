
const gulp = require("gulp"),
      imagemin = require("gulp-imagemin"),
      usemin = require("gulp-usemin"),
      del = require("del"),
      rev = require("gulp-rev"),
      cssnano = require("gulp-cssnano"),
      uglify = require("gulp-uglify"),
      gulpSync = require("gulp-sync")(gulp);


gulp.task("deleteDistFolder", function() {
    return del("./public/dist/");
});

// NOT IN USE - images are put in css as data:
gulp.task("optimizeImages", function() {
    return gulp.src(["./public/assets/images/*", "!./public/assets/images/*.scss"]) // include - ! exclude
        .pipe(imagemin({
            progressive: true,  // optimize jpeg
            interlaced: true,   // -- || -- gif
            multipass: true     // -- || -- svg
        }))
        .pipe(gulp.dest("./public/dist"))
});

// NOT IN USE - have pug not html files - Deteils video toward the end of course
gulp.task("usemin", ["deleteDistFolder"], function() {
    return gulp.src("./index.html")
        .pipe(usemin({
                css: [function() {return rev()}, function() {return cssnano()}],
                js: [function() {return rev()}, function() {return uglify()}],
            })
        )
});




gulp.task("build", gulpSync.sync(["deleteDistFolder", "scripts", "scriptsVoting", "styles"]));