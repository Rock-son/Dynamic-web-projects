"use strict"

require("dotenv").config();

const express = require("express"),
      http = require("http"),
      path = require("path"),
      fs = require("fs"),
      postcssMiddleware = require("postcss-middleware"),
      autoprefixer = require("autoprefixer"),
      postcss_scss = require("postcss-scss"),
      bodyParser = require("body-parser"),
      // ROUTES
      votingApp = require("./voting_app/voting_app"),
      // SECURITY
      helmet = require("helmet"),
      helmet_csp = require("helmet-csp"),  
      // LOGGING
      morgan = require('morgan'),
      accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", 'access.log'), {flags: 'a'}), // writable stream - for MORGAN logging
      Log = require("./services/morganLog"),    
      // DB
      mongoose = require("mongoose"),      
      dbUrl = process.env.DBLINK,
      // PORT & ROUTER
      port = process.env.PORT || 3000,
      app = express();




// App Setup
app.use(bodyParser.json({type: "*/*"}));
app.use(morgan({stream: accessLogStream}));
app.set(express.static(path.join(__dirname, "public")));
// CSS Setup

app.use("/voting-app", votingApp);


// SECURITY middleware (Helmet, Helmet-csp)
app.use(helmet({dnsPrefetchControl: {allow: true}}));

/*app.use(function(req, res, next) {
      res.set({
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Headers" : "Origin, X-Requested-With, content-type, Accept"
      });
      app.disable('x-powered-by');
      next();
});*/



app.use(helmet_csp({
directives: {
      scriptSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      imgSrc: ['img.com', 'data:'],
      sandbox: ['allow-forms', 'allow-scripts'],
      reportUri: '/report-violation' // set up a POST route for notifying / logging data to server
},
//reportOnly: does not block request (for debugging purposes)
reportOnly: function (req, res) {
            if (req.query.cspmode === 'debug') {
                  return true
            } else {
                  return false
            }
      }
}));



// DB Setup
mongoose.connect(dbUrl);



// logging (Helmet-csp) CSP blocked requests
app.post("/report-violation", Log.logged);


//Server Setup
const server = http.createServer(app);
server.listen(port, () => console.log("Listening on port: " + port));