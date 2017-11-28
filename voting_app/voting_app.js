"use strict"

var fs = require("fs"),
    path = require("path"),
    // PASSPORT service
    express = require("express"),
    app = express(),
    pug = require("pug"),
    indexCSS = "./assets/styles/index.css";

    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "pug");
    app.use(express.static(path.join(__dirname, 'public')));



    app.get("/", function(req, res) {
        res.render("indexVoting", { cssPath: indexCSS })
    });



module.exports = app;