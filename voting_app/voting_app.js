"use strict"

var Authentication = require("./controllers/authentication"),
    fs = require("fs"),
    path = require("path"),
    // PASSPORT service
    passportService = require("./services/passport"),
    passport = require("passport"),
    express = require("express"),
    app = express.Router(),
    pug = require("pug"),
    // AUTHORIZE
    requireAuth = passport.authenticate("jwt", {session: false}),
    requireSignin = passport.authenticate("local", {session: false});



/*  app.get("/", requireAuth, function(req, res) {
        res.send({hi: "there"});
    });*/
    app.get("/", function(req, res) {
        res.render("votingApp", { author: "ROK" })
    });
    // sign up
    app.post("/signup", Authentication.signup);
    // sign in
    app.post("/signin", requireSignin, Authentication.signin);       




module.exports = app;