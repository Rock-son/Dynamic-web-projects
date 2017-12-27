"use strict"

var fs = require("fs"),
    path = require("path"),
    //DB 
    db = require("../db/controllers/insertData"),
    // PASSPORT service
    express = require("express"),
    pug = require("pug"),
    indexCSS = "./dist/index.css", newPollCSS = "./dist/newPoll.css",
    passportService = require("../auth/services/passport"),
    passport = require("passport"),
    escapeHtml = require('escape-html'),
    
    app = express();
    
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "pug");
    app.use(express.static(path.join(__dirname, 'public')));

    ensureAuthenticated = passport.authenticate('jwt', {session: false, failureRedirect: "/auth/login"});


    app.route("/") 
        .get(function(req, res, next) {
          passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                if (err) { return next(err) }
                if (!user) { return res.render("index", { cssPath: indexCSS, auth: false, user: "" }); }
                return res.render("index", { cssPath: indexCSS, auth: true, user: escapeHtml(user.username || user.displayName) });
        })(req, res, next);
    });


    app.route("/createPoll")
        .get(function(req, res, next) {
            passport.authenticate('jwt', {session: false, failureRedirect: "/auth/login"}, function(err, user, info, status) {
                if (err) { return next(err) }
                if (!user) { return res.redirect("/auth/login"); }
                return res.render("createPoll", { cssPath: newPollCSS, auth: true, user: escapeHtml(user.username || user.displayName) });
            })(req, res, next);
        })
        .post(ensureAuthenticated, db.insertFormData);


    app.get("/myPoll:poll", function(req, res, next) {

    });

    app.get("/myPolls", function(req, res, next) {

    }); 

module.exports = app;