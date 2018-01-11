"use strict"

var fs = require("fs"),
    path = require("path"),
    express = require("express"),
    pug = require("pug"),
    // DB
    db = require("../db/controllers/controller"),
    // ASSETS
    homeCSS = "./dist/homePage.css", 
    createPollCSS = "./dist/createPoll.css",
    mainJS = (function() {return "./dist/"+ (/(main_[-\w]*\.js)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["main.js"] )[0] })(),
    createPollJS = (function() {return "./dist/"+ (/(createPoll_[-\w]*\.js)/.exec(fs.readdirSync(path.resolve(__dirname, "public/dist/")).join(",")) || ["createPoll.js"] )[0] })(),
    // PASSPORT
    passportService = require("../auth/services/passport"),
    passport = require("passport"),
    escapeHtml = require('escape-html'),
    
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
                return res.render("homePage", { cssPath: homeCSS, auth: true, user: escapeHtml(user.username || user.displayName) });
        })(req, res, next);
    });


    app.route("/createPoll")
        .get(function(req, res, next) {
            passport.authenticate('jwt', {session: false, failureRedirect: "/auth/login"}, function(err, user, info, status) {
                if (err) { return next(err) }
                if (!user) { return res.redirect("/auth/login"); }
                return res.render("createPoll", { js: createPollJS, cssPath: createPollCSS, auth: true, user: escapeHtml(user.username || user.displayName) });
            })(req, res, next);
        })
        .post(ensureAuthenticated, db.insertFormData);


    app.get("/poll:id", function(req, res, next) {
        

    });

    app.get("/myPolls", function(req, res, next) {

    }); 

module.exports = app;