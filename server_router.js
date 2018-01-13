"use strict"

module.exports = function(app) {
      
            // AUTHENTICATION
      const Authentication = require("./auth/controllers/authentication"),
            passportService = require("./auth/services/passport"),
            passport = require("passport"),
            fs = require("fs"),
            // SECURITY
            csrf = require("csurf"),
            csrfProtection = csrf({ cookie: true }),
            path = require("path"),
            homepageCSS = (function() {return "/dist/"+ (/(index[-\w]*\.css)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["index.js"] )[0] })(),
            mainJS = (function() {return "/dist/"+ (/(main[-\w]*\.js)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["main.js"] )[0] })(),
            register_loginCSS = (function() {return "/dist/"+ (/(register[-\w]*\.css)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["main.js"] )[0] })(),
            fontArr = require("./public/assets/fonts/fontAllow"),
            // SANITIZE USER INPUT
            xssFilterJS = "./dist/xss-filters.min.js",

            ensureAuthenticated = passport.authenticate("jwt", { session: false, failureRedirect: "/auth/login"}),     // jwt - one strategy
            verifyLoginData = passport.authenticate("local", { session: false });  // login - input user & pass - for POST

            
      /***************************************************** ROUTES ***************************************************************************/

      // HOME ROUTE
      app.get ("/", function(req, res, next) {            
            passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                  
                  if (err) { return next(err) }
                  if (!user) {return res.render("index", { cssPath: homepageCSS, auth: false, login: false, user: "" }); }
                  return res.render("index", {cssPath: homepageCSS, auth: true, login: false, user: xssFilters.inHTMLData(user.username || user.displayName) });
            })(req, res, next);
      });


      // REGISTER PAGE
      app.route("/auth/register")
            // JWT STRATEGY
            .get(csrfProtection, function(req, res, next) {
                  passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                        if (err) { return next(err) }
                        if (!user) {return res.render("register", {action: "/auth/register", csrfTkn: req.csrfToken(), reverseType: "/auth/login", footnote: "Have an account?", cssPath: register_loginCSS, auth: false}); }
                        return res.redirect("/");
                  })(req, res, next);
            })
            // LOCAL STRATEGY
            .post(csrfProtection, Authentication.register);

      // LOGIN PAGE
      app.route("/auth/login")
            // JWT STRATEGY
            .get(csrfProtection, function(req, res, next) {
                  passport.authenticate('jwt', {session: false}, function(err, user, info, status) {                  
                        if (err) { return next(err) }
                        if (!user || user == null) {return res.render("register", {action: "/auth/login", csrfTkn: req.csrfToken(), reverseType: "/auth/register", footnote: "Register?", cssPath: register_loginCSS, auth: false}); }
                        return res.redirect("/");
                  })(req, res, next);
            })
            // LOCAL STRATEGY
            .post(csrfProtection, verifyLoginData, Authentication.login);


      // LOGOUT
      app.get("/auth/logout", Authentication.logout);






      /******************************************* AUTHORIZATION ******************************************************************************/


      /******************** OAUTH ***********************/

      // GITHUB
      app.get("/auth-github", passport.authenticate("github", { session: false }));

      app.get("/auth/github/callback", function(req, res) {
            passport.authenticate("github", {session: false}, function(err, user, info, status) {
                  Authentication.schemaLogin(req, res, user, "github");
            })(req, res)
      });

      // GOOGLE
      app.get("/auth-google", passport.authenticate("google", { session: false }));

      app.get("/auth/google/callback", function(req, res) {
            passport.authenticate("google", {session: false}, function(err, user, info, status) {                  
                  Authentication.schemaLogin(req, res, user, "google");
            })(req, res)
      });

      // FACEBOOK
      app.get("/auth-facebook", passport.authenticate("facebook", { session: false }));

      app.get("/auth/facebook/callback", function(req, res) {
            passport.authenticate("facebook", {session: false}, function(err, user, info, status) {
                  Authentication.schemaLogin(req, res, user, "facebook");
            })(req, res)
      });



      /******************************************* MISCELANEOUS *******************************************************************/

      // FONTS
      app.get("/public/assets/fonts/*", function(req, res) {
            if (fontArr.indexOf(req.url.replace(/^public\/assets\/fonts\//, "") > -1)) {
                  fs.createReadStream(path.join(__dirname, req.url)).pipe(res);
            } else {
                  res.status(204).send();
            }
      });
}



