"use strict"

require("dotenv").config();

const express = require("express"),
      http = require("http"),
      path = require("path"),
      fs = require("fs"),
      bodyParser = require("body-parser"),
      // templating and scss      
      pug = require("pug"),
      // ROUTES
      votingApp = require("./voting_app/voting_app"),
      // SECURITY
      fontArr = require("./public/assets/fonts/fontAllow"),
      helmet = require("helmet"),
      helmet_csp = require("helmet-csp"),  
      // LOGGING
      morgan = require('morgan'),
      Log = require("./logs/services/morganLog"), 
      //accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", 'access.log'), {flags: 'a'}), // writable stream - for MORGAN logging   
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



// SECURITY middleware (Helmet, Helmet-csp)
app.use(helmet({dnsPrefetchControl: {allow: true}}));
app.use(helmet_csp({
directives: {
  //    defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "https:", "www.dl.dropboxusercontent.com", "https://www.dl.dropboxusercontent.com"],
      sandbox: ['allow-forms', 'allow-scripts'],
      reportUri: '/report-violation' // set up a POST route for notifying / logging data to server
},
reportOnly: function (req, res) {
            if (req.query.cspmode === 'debug') {
                  return true
            } else {
                  return false
            }
      }
}));
app.use(function(req, res, next) {
      res.set({
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Headers" : "Origin, X-Requested-With, content-type, Accept"
      });
      app.disable('x-powered-by');
      next();
});


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


// logging (Helmet-csp) CSP blocked requests
app.post("/report-violation", Log.logged);


//Server Setup
const server = http.createServer(app);
server.listen(port, () => console.log("Listening on port: " + port));