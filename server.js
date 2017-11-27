"use strict"

require("dotenv").config();

const express = require("express"),
      http = require("http"),
      path = require("path"),
      fs = require("fs"),
      bodyParser = require("body-parser"),
      // AUTHENTICATION
      Authentication = require("./auth/controllers/authentication"),
      passportService = require("./auth/services/passport"),
      passport = require("passport"),
      requireAuth = passport.authenticate("jwt", {session: false}),
      requireSignin = passport.authenticate("local", {session: false}),
      // pug    
      pug = require("pug"),
      // ROUTES
      votingApp = require("./voting_app/voting_app"),
      // SECURITY
      fontArr = require("./public/assets/fonts/fontAllow"),
      helmet = require("./security/helmet"),
      // LOGGING:  morgan = require('morgan'),  Log = require("./logs/services/morganLog"), accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", 'access.log'), {flags: 'a'}), // writable stream - for MORGAN logging
      // DB
      mongoose = require("mongoose"),      
      dbUrl = process.env.DBLINK,
      // PORT & ROUTER
      port = process.env.PORT || 3000,
      app = express();




      // App Setup
      app.use(bodyParser.json({type: "*/*"}));
      app.use(bodyParser.json({
            type: ['json', 'application/csp-report']
      }))
      //app.use(morgan({stream: accessLogStream}));
      app.set("views", path.join(__dirname, "views"));
      app.set("view engine", "pug");
      app.use(express.static(path.join(__dirname, 'public')));

      // SECURITY
      helmet(app);


      // ROUTING
      app.use("/voting-app", votingApp);


      // DB Setup
      mongoose.connect(dbUrl);




      app.get("/", function(req, res) {
            res.render("index", {author: "ROK"})
      });


      app.get("/public/assets/fonts/*", function(req, res) {
            if (fontArr.indexOf(req.url.replace(/^public\/assets\/fonts\//, "") > -1)) {
                  fs.createReadStream(path.join(__dirname, req.url)).pipe(res);
            } else {
                  res.status(204).send();
            }
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
    app.post("/signup", Authentication.signup);
    // sign in
    app.post("/signin", requireSignin, Authentication.signin);       


            
      // logging (Helmet-csp) CSP blocked requests
      //app.post("/report-violation", Log.logged);


      //Server Setup
      const server = http.createServer(app);
      server.listen(port, () => console.log("Listening on port: " + port));