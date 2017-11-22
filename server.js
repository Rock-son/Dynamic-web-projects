"use strict"

require("dotenv").config();

const express = require("express"),
      http = require("http"),
      path = require("path"),
      fs = require("fs"),
      bodyParser = require("body-parser"),
      // templating and scss      
      pug = require("pug"),
      postcss = require("postcss"),
      postcssMiddleware = require("postcss-middleware"),
      autoprefixer = require("autoprefixer"),
      postcss_scss = require("postcss-scss"),
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
app.use('/^\/css\/([a-z-]+)\.css$/', postcssMiddleware({

      src: (req) => {            
            path.join("public", req.params[0],"*css"); // callback added to express req obj - build a path to folder or file wish to be read/parsed
      }, 
      plugins: [autoprefixer, postcss_scss],
      options: {
            parser: postcss_scss
      }
}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, 'public')));
// CSS Setup

app.use("/voting-app", votingApp);


// SECURITY middleware (Helmet, Helmet-csp)
app.use(helmet({dnsPrefetchControl: {allow: true}}));




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

app.get("/", function(req, res) {
      const articles = [
            {
                  id: 1,
                  title: "Article One",
                  author: "Brad Cavanaugh",
                  body: "This is article One"
            },
            {
                  id: 2,
                  title: "Article Two",
                  author: "Ziggy Filters",
                  body: "This is article two"
            },
            {
                  id: 3,
                  title: "Article Three",
                  author: "Tobacco Man",
                  body: "This is article three"
            }

      ]
      res.render("index", {author: "ROK", view: req.path, articles})
});

// logging (Helmet-csp) CSP blocked requests
app.post("/report-violation", Log.logged);


//Server Setup
const server = http.createServer(app);
server.listen(port, () => console.log("Listening on port: " + port));












/*app.use(function(req, res, next) {
      res.set({
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Headers" : "Origin, X-Requested-With, content-type, Accept"
      });
      app.disable('x-powered-by');
      next();
});*/