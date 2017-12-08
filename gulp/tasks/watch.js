const gulp = require("gulp"),
      watch = require("gulp-watch"),
      // OUTPUT DIRs
      homeOutputPath = "./public/assets/styles/",
      votingOutputPath = "./voting_app/public/assets/styles/",
      // STARTING DIRs
      homeStylePath = homeOutputPath + "scss/home/",
      registerStylePath = homeOutputPath + "scss/register/",
      votingAppStylePath = votingOutputPath + "scss/",
      scriptsPath = "./public/assets/scripts/",      
      votingScriptsPath = "./voting_app/public/assets/scripts/"


gulp.task('start', ['watch']);

gulp.task("watch", function() {
    
    watch(homeStylePath + "*.scss", () => gulp.start("homePageStyles"));
    watch(homeOutputPath + "**/*.scss", () => gulp.start("homePageStyles", "registerPageStyles"));
    watch("./public/assets/styles/shared/*.scss", () => gulp.start(["homePageStyles", "votingPageStyles", "registerPageStyles"]));
    watch(votingAppStylePath + "**/*.scss", () => gulp.start("votingPageStyles"));
    watch(scriptsPath + "*.js", () => gulp.start("scripts"));
    watch(votingScriptsPath + "*.js", () => gulp.start("scriptsVoting"));
});