"use strict"

module.exports = function(app) {
 
      // AUTHENTICATION
const Authentication = require("./auth/controllers/authentication"),
      passportService = require("./auth/services/passport"),
      passport = require("passport"),
      fs = require("fs"),
      path = require("path"),
      homepageCSS = (function() {return "/dist/"+ (/(index[-\w]*\.css)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["index.js"] )[0] })(),
      mainJS = (function() {return "/dist/"+ (/(main[-\w]*\.js)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["main.js"] )[0] })(),
      register_loginCSS = (function() {return "/dist/"+ (/(register[-\w]*\.css)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["main.js"] )[0] })(),
      fontArr = require("./public/assets/fonts/fontAllow"),
      // SANITIZE USER INPUT
      escapeHtml = require('escape-html'),

      ensureAuthenticated = passport.authenticate("jwt", {session: false, failureRedirect: "/auth/login"}),     // jwt - one strategy
      verifyLogin = passport.authenticate("local", {session: false});  // login - input user & pass - for POST
     



// HOME ROUTE
app.route("/") 
      .get(function(req, res, next) {

            passport.authenticate('jwt', {session: false}, function(err, user, info, status) {                  
                  if (err) { return next(err) }
                  if (!user) {return res.render("index", { cssPath: homepageCSS, auth: false, login: false, user: "test", mainJS: mainJS }); }
                  return res.render("index", {cssPath: homepageCSS, auth: true, login: false, user: escapeHtml(user.username), mainJS: mainJS });
            })(req, res, next);
      });




// AUTHORIZATION - REGISTER & LOGIN PAGE
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
  



app.route("/auth/logout")
      .get(function(req, res, next) {
            
            res.cookie("_t1", "", {
                  httpOnly: true,
                  secure: false,
                  sameSite: true,
                  maxAge: -1,
                  exp: new Date(1).getTime()
          });
          res.statusCode = 302;
          res.set({'Location': req.headers.referer});
          res.end();
          return;
      });
      
       
       





  // GITHUB oAuth
app.get("/auth/github/callback", function(req, res) {

     
      console.log("not implemented yet!");
      res.end();
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



