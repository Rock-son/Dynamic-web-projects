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


    // HOME ROUTE
    app.route("/") 
        .get(function(req, res, next) {
          passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                if (err) { return next(err) }
                if (!user) { 
                    const options = { fetch: {}, cssPath: homeCSS, auth: false, user: "" };
                    return db.showPolls(req, res, next, options);
                }
                const options = { fetch: {}, cssPath: homeCSS, auth: true, user: xssFilters.inHTMLData(user.username || user.displayName) };
                return db.showPolls(req, res, next, options);
        })(req, res, next);
    });

    // CREATE POLL
    app.route("/createPoll")
        .get(csrfProtection, function(req, res, next) {
            passport.authenticate('jwt', {session: false, failureRedirect: "/auth/login"}, function(err, user, info, status) {
                if (err) { return next(err) }
                if (!user) { return res.redirect("/auth/login"); }
                return res.render("createPoll", { js: createPollJS, cssPath: createPollCSS, csrfTkn: req.csrfToken(), auth: true, user: xssFilters.inHTMLData(user.username || user.displayName) });
            })(req, res, next);
        })
        .post(ensureAuthenticated, csrfProtection, db.insertPollData);


    // SHOW SPECIFIC POLL
    app.route("/poll")
        .get(csrfProtection, function(req, res, next) {
            passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                if (err) { return next(err) }

                if (!user) { 
                    const options = { js: pollJS, cssPath: pollCSS, csrfTkn: req.csrfToken(), auth: false };
                    return db.managePollData(req, res, next, options);
                } 
                const options = { js: pollJS, cssPath: pollCSS, csrfTkn: req.csrfToken(), auth: true, user: xssFilters.inHTMLData(user.username || user.displayName) };
                return db.managePollData(req, res, next, options);
            
            })(req, res, next);
        })
        .post(csrfProtection, db.updatePollOPtions);

    // SHOW ALL POLLS OF A LOGGED-ON USER
    app.get("/myPolls", csrfProtection, function(req, res, next) {
        passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
            if (err) { return next(err) }

            if (!user) { return res.redirect("/auth/login"); }
            
            const options = { fetch: { createdBy: user.username || user.displayName }, cssPath: homeCSS, csrfTkn: req.csrfToken(), auth: true, user: xssFilters.inHTMLData(user.username || user.displayName) };
            return db.showPolls(req, res, next, options);
        
        })(req, res, next);
    }); 

module.exports = app;