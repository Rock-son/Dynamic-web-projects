"use strict"

module.exports = function(app) {
 
      // AUTHENTICATION
const Authentication = require("./auth/controllers/authentication"),
      passportService = require("./auth/services/passport"),
      passport = require("passport"),
      homepageCSS = "/assets/styles/index.css",
      register_loginCSS = "/assets/styles/register.css",
      fontArr = require("./public/assets/fonts/fontAllow"),
      fs = require("fs"),
      path = require("path"),
      // SANITIZE USER INPUT
      xssFilters = require('xss-filters'),

      requireAuth = passport.authenticate("jwt", {session: false}),     // jwt - one strategy
      requireLogin = passport.authenticate("local", {session: false}),  // login - input user & pass - for POST
      checkAuth = passport.authenticate(['jwt', 'twitter', 'google', 'github'], {session: false}); // iterate through all strategies until succes or fail


//app.use(bodyParser.json({type: "*/*"}));// for parsing application/json 


// HOME ROUTE
app.route("/") 
      .get(function(req, res, next) {
            passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                  if (err) { return next(err) }
                  if (!user) {return res.render("index", { cssPath: homepageCSS, auth: false, login: false, user: "" }); }
                  return res.render("index", {cssPath: homepageCSS, auth: true, login: false, user: xssFilters.inHTMLData(user) });
            })(req, res, next);
      });




// AUTHORIZATION - REGISTER & LOGIN PAGE
app.route("/auth/register")
      .get(function(req, res, next) {
            passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                  if (err) { return next(err) }
                  if (!user) {return res.render("register", {action: "/auth/register", reverseType: "/auth/login", footnote: "Have an account?", cssPath: register_loginCSS, auth: false}); }
                  return res.redirect(req.headers.referer);
            })(req, res, next);
      })
      .post(Authentication.register);



app.route("/auth/login")
.get(function(req, res, next) {
      passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
            if (err) { return next(err) }
            if (!user) {return res.render("register", {action: "/auth/login", reverseType: "/auth/register", footnote: "Register?", cssPath: register_loginCSS, auth: false}); }
            return res.redirect(req.headers.referer);
      })(req, res, next);
})
      .post(requireLogin, Authentication.login); 
  
      // PURE AUTHORIZATION - stopped if not logged in
  /*  app.get("/", requireAuth, function(req, res) {
    res.send({hi: "there"});
});*/





  // GITHUB oAuth
app.get("/auth/github", function(req, res) {

      //TODO: PUT IN SERVICES
      const CLIENT_ID = process.env.GITHUB_ID,
            GITHUB_SECRET = process.env.GITHUB_SECRET,
            SCOPE = "user:email",
            CSRF_KEY = process.env.GITHUB_CSRF_KEY,
            REDIRECT_URI = "https://fcc-dynamic-webapps-roky.herokuapp.com/voting_app";
     
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



