"use strict"

var fs = require("fs"),
    path = require("path"),
    // PASSPORT service
    express = require("express"),
    pug = require("pug"),
    indexCSS = "./assets/styles/index.css",
    passportService = require("../auth/services/passport"),
    passport = require("passport"),
    
    app = express();

    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "pug");
    app.use(express.static(path.join(__dirname, 'public')));



    app.route("/") 
        .get(function(req, res, next) {
          passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
                if (err) { return next(err) }
                if (!user) {return res.render("indexVoting", { cssPath: indexCSS, auth: false}); }
                return res.render("indexVoting", {cssPath: indexCSS, auth: true});
        })(req, res, next);
    });


module.exports = app;