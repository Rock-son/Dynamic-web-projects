"use strict"

module.exports = function(app) {
 
      // AUTHENTICATION
const Authentication = require("./auth/controllers/authentication"),
      passportService = require("./auth/services/passport"),
      passport = require("passport"),
      homepageCSS = "./assets/styles/index.css",
      register_loginCSS = "../assets/styles/register.css",
      fontArr = require("./public/assets/fonts/fontAllow"),
      
      requireAuth = passport.authenticate("jwt", {session: false}),
      requireLogin = passport.authenticate("local", {session: false});

app.get("/", function(req, res) {
        res.render("index", {cssPath: homepageCSS});
});


// AUTHORIZE

// REGISTER & LOGIN PAGE
app.get("/auth/register", function(req, res) {

      res.render("register", {type: "/register", cssPath: register_loginCSS});
});
app.get("/auth/login", function(req, res) {
      
      
      res.render("register", {type: "/login", cssPath: register_loginCSS});
});



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



  
  /*  app.get("/", requireAuth, function(req, res) {
    res.send({hi: "there"});
});*/

 
//TODO:!!!
// sign up
app.post("/register", Authentication.register);
// sign in
app.post("/login", requireLogin, Authentication.login);       


// FONTS
app.get("/public/assets/fonts/*", function(req, res) {
      if (fontArr.indexOf(req.url.replace(/^public\/assets\/fonts\//, "") > -1)) {
            fs.createReadStream(path.join(__dirname, req.url)).pipe(res);
      } else {
            res.status(204).send();
      }
});


}



