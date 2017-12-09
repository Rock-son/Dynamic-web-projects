const gulp = require("gulp"),
      watch = require("gulp-watch"),
      // OUTPUT DIRs
      homeOutputPath = "./public/assets/styles/partial/",
      votingOutputPath = "./voting_app/public/assets/styles/partial/",
      // STARTING DIRs
      homeStylePath = homeOutputPath + "home/",
      registerStylePath = homeOutputPath + "register/",
      votingAppStylePath = votingOutputPath + "index/",
      scriptsPath = "./public/assets/scripts/",      
      votingScriptsPath = "./voting_app/public/assets/scripts/"


gulp.task('start', ['watch']);

gulp.task("watch", function() {
    
    watch(homeStylePath + "*.scss", () => gulp.start("homePageStyles"));
    watch(registerStylePath + "*.scss", () => gulp.start("registerPageStyles"));
    watch(homeOutputPath + "shared/*.scss", () => gulp.start(["homePageStyles", "votingPageStyles", "registerPageStyles"]));
    watch(votingOutputPath + "**/*.scss", () => gulp.start("votingPageStyles"));
    watch(scriptsPath + "*.js", () => gulp.start("scripts"));
    watch(votingScriptsPath + "*.js", () => gulp.start("scriptsVoting"));
});