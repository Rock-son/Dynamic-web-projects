"use strict"

module.exports = function(app) {
      
            // AUTHENTICATION
      const Authentication = require("./auth/controllers/authentication"),
            passport = require("passport"),
            fs = require("fs"),
            path = require("path"),
            homepageCSS = (function() {return "/dist/"+ (/(index[-\w]*\.css)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["index.js"] )[0] })(),
            mainJS = (function() {return "/dist/"+ (/(main[-\w]*\.js)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["main.js"] )[0] })(),
            register_loginCSS = (function() {return "/dist/"+ (/(register[-\w]*\.css)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["main.js"] )[0] })(),
            fontArr = require("./public/assets/fonts/fontAllow"),
            // SANITIZE USER INPUT
            escapeHtml = require('escape-html'),

            ensureAuthenticated = passport.authenticate("jwt", { session: false, failureRedirect: "/auth/login"}),     // jwt - one strategy
            verifyLogin = passport.authenticate("local", { session: false });  // login - input user & pass - for POST



      // HOME ROUTE
      app.get ("/", function(req, res, next) {
            
            passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                  
                  if (err) { return next(err) }
                  if (!user) {return res.render("index", { cssPath: homepageCSS, auth: false, login: false, user: "", mainJS: mainJS }); }
                  return res.render("index", {cssPath: homepageCSS, auth: true, login: false, user: escapeHtml(user.username || user.displayName), mainJS: mainJS });
            })(req, res, next);
      });




      // AUTHORIZATION - REGISTER (LOCAL) & LOGIN PAGE (JWT)
      app.route("/auth/register")

            .get(function(req, res, next) {

                  passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                        if (err) { return next(err) }
                        if (!user) {return res.render("register", {action: "/auth/register", reverseType: "/auth/login", footnote: "Have an account?", cssPath: register_loginCSS, auth: false}); }
                        return res.redirect("/");
                  })(req, res, next);
            })
            .post(Authentication.register);


      app.route("/auth/login")

            .get(function(req, res, next) {

                  passport.authenticate('jwt', {session: false}, function(err, user, info, status) {                  
                        if (err) { return next(err) }
                        if (!user || user == null) {return res.render("register", {action: "/auth/login", reverseType: "/auth/register", footnote: "Register?", cssPath: register_loginCSS, auth: false}); }
                        return res.redirect("/");
                  })(req, res, next);
            })      
            .post(verifyLogin, Authentication.login); 

      // LOGOUT
      app.get("/auth/logout", Authentication.logout);



      // OAUTH

      //GITHUB
      app.get("/auth-github", passport.authenticate("github", { session: false }));

      app.get("/auth/github/callback", function(req, res) {

            passport.authenticate("github", {session: false}, function(err, user, info, status) {
                  Authentication.schemaLogin(req, res, user, "github");
            })(req, res)
      });

      //GOOGLE
      app.get("/auth-google", passport.authenticate("google", { session: false }));

      app.get("/auth/google/callback", function(req, res) {

            passport.authenticate("google", {session: false}, function(err, user, info, status) {
                  console.log(err, user, info, status);
                  Authentication.schemaLogin(req, res, user, "google");
            })(req, res)
      });




      // FONTS
      app.get("/public/assets/fonts/*", function(req, res) {
            if (fontArr.indexOf(req.url.replace(/^public\/assets\/fonts\//, "") > -1)) {
                  fs.createReadStream(path.join(__dirname, req.url)).pipe(res);
            } else {
                  res.status(204).send();
            }
      });
}



