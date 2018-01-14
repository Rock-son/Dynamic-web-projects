"use strict"

require("dotenv").config();

const express = require("express"),
      http = require("http"),
      path = require("path"),
      fs = require("fs"),
      bodyParser = require("body-parser"),
      // pug    
      pug = require("pug"),
      // ROUTES
      votingApp = require("./voting_app/voting_app"),
      router = require("./server_router"),
      // SECURITY
      helmet = require("./security/helmet"),
      hpp = require("hpp"),
      csrf = require("csurf"),
      cookieParser = require("cookie-parser"),
      cookieEncrypter = require("cookie-encrypter"),
      // LOGGING:  morgan = require('morgan'),  Log = require("./logs/services/morganLog"), accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", 'access.log'), {flags: 'a'}), // writable stream - for MORGAN logging
      // DB
      mongoose = require("mongoose"),      
      dbUrl = process.env.DBLINK,
      // PORT & ROUTER
      port = process.env.PORT || 3000,
      app = express(),
      RateLimit = require('express-rate-limit');



      // COOKIE & BODY PARSERS
      app.use(cookieParser(process.env.CRYPTO_KEY));
      app.use(cookieEncrypter(process.env.CRYPTO_KEY));


      app.use(bodyParser.json({type: "application/json"}));
      app.use(bodyParser.json({ type: ['json', 'application/csp-report'] }));
      app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
      app.use(hpp());

      //app.use(morgan({stream: accessLogStream}));
      app.set("views", path.join(__dirname, "views"));
      app.set("view engine", "pug");
      app.use(express.static(path.join(__dirname, 'public')));



      // SECURITY
      app.use(csrf({cookie: true}));
      helmet(app);
      // CSRF ERROR HANDLER
      app.use(function (err, req, res, next) {
            if (err.code !== 'EBADCSRFTOKEN') return next(err)
      
            // handle CSRF token errors here 
            res.status(403)
            res.send('form tampered with')
      });

      // LIMITER
      const limiter = new RateLimit({
            windowMs: 15*60*1000, // 15 minutes
            max: 200, // limit each IP to 10 requests per windowMs
            delayMs: 0 // disable delaying - full speed until the max limit is reached
          });
      app.use(limiter);

      // ROUTER
      app.use("/voting-app", votingApp);



      // DB
      mongoose.connect(dbUrl);



      // ROUTES
      router(app);

            
      // logging (Helmet-csp) CSP blocked requests
      //app.post("/report-violation", Log.logged);


      //SERVER
      http.createServer(app)
            .listen(port, () => console.log("Listening on port: " + port));