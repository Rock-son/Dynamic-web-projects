"use strict"

var fs = require("fs"),
    path = require("path"),
    express = require("express"),
    pug = require("pug"),
    // DB
    db = require("../db/controllers/controller"),
    // SECURITY
    csrf = require("csurf"),
    csrfProtection = csrf({ cookie: true }),
    xssFilters = require("xss-filters"),
    // ASSETS
    homeCSS = "./dist/homePage.css", 
    createPollCSS = "./dist/createPoll.css",
    pollCSS = "./dist/poll.css",
    mainJS = (function() {return "./dist/"+ (/(main_[-\w]*\.js)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["main.js"] )[0] })(),
    createPollJS = (function() {return "./dist/"+ (/(createPoll_[-\w]*\.min\.js)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["createPoll.js"] )[0] })(),
    pollJS = (function() {return "./dist/"+ (/(poll_[-\w]*\.min\.js)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["poll.js"] )[0] })(),
    xssFilters = require("xss-filters"),
    // PASSPORT
    passportService = require("../auth/services/passport"),
    passport = require("passport"),
    
    app = express(),

    ensureAuthenticated = passport.authenticate('jwt', {session: false, failureRedirect: "/auth/login"});
    
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "pug");
    app.use(express.static(path.join(__dirname, 'public')));



    app.route("/") 
        .get(function(req, res, next) {
          passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                if (err) { return next(err) }
                if (!user) { return res.render("homePage", { cssPath: homeCSS, auth: false, user: "" }); }
                return res.render("homePage", { cssPath: homeCSS, auth: true, user: xssFilters.inHTMLData(user.username || user.displayName) });
        })(req, res, next);
    });


    app.route("/createPoll")
        .get(csrfProtection, function(req, res, next) {
            passport.authenticate('jwt', {session: false, failureRedirect: "/auth/login"}, function(err, user, info, status) {
                if (err) { return next(err) }
                if (!user) { return res.redirect("/auth/login"); }
                return res.render("createPoll", { js: createPollJS, cssPath: createPollCSS, csrfTkn: req.csrfToken(), auth: true, user: xssFilters.inHTMLData(user.username || user.displayName) });
            })(req, res, next);
        })
        .post(ensureAuthenticated, csrfProtection, db.insertFormData);


    app.get("/poll", csrfProtection, function(req, res, next) {        
        passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
            if (err) { return next(err) }

            if (!user) { 
                const options = { js: pollJS, cssPath: pollCSS, csrfTkn: req.csrfToken(), auth: false };
                db.managePollData(req, res, next, options);
            } else {
                const options = { js: pollJS, cssPath: pollCSS, csrfTkn: req.csrfToken(), auth: true, user: xssFilters.inHTMLData(user.username || user.displayName) };
                db.managePollData(req, res, next, options);
            }    
        })(req, res, next);
    });
    
    app.get("/getPollData", db.getPollData);

    app.get("/myPolls", function(req, res, next) {

    }); 

module.exports = app;