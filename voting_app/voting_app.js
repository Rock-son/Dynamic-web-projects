"use strict"

var Authentication = require("./controllers/authentication"),
    fs = require("fs"),
    path = require("path"),
    postcssMiddleware = require("postcss-middleware"),
    autoprefixer = require("autoprefixer"),
    postcss_scss = require("postcss-scss"),
    // PASSPORT service
    passportService = require("./services/passport"),
    passport = require("passport"),
    express = require("express"),
    app = express.Router(),
    // AUTHORIZE
    requireAuth = passport.authenticate("jwt", {session: false}),
    requireSignin = passport.authenticate("local", {session: false});


    app.use(express.static(path.join(__dirname, "public")));
    




    app.get("/", requireAuth, function(req, res) {
        res.send({hi: "there"});
    });
    // sign up
    app.post("/signup", Authentication.signup);
    // sign in
    app.post("/signin", requireSignin, Authentication.signin);       




module.exports = app;