"use strict"

const passport = require("passport"),
      User = require("../models/user"),
      JwtStrategy = require("passport-jwt").Strategy,
      GitHubStrategy = require('passport-github').Strategy,
      TwitterStrategy = require('passport-twitter').Strategy,
      FacebookStrategy = require('passport-facebook').Strategy,
      GoogleStrategy = require('passport-google-oauth20').Strategy,
      ExtractJwt = require("passport-jwt").ExtractJwt,
      LocalStrategy = require("passport-local"),
      // SANITIZATION
      mongoSanitize = require("mongo-sanitize");



// LOCAL strategy - REGISTER with a password
const localOptions = {usernameField: "username"};

const localLogin = new LocalStrategy(localOptions, function(username, password, done) {
      // verify this email and password, call done w/ user if correct, else call done w/false
      const userName = mongoSanitize(username),
            pass = mongoSanitize(password);
      User.findOne({username: userName}, function(err, user) {
            if (err) { return done(err, false); }

            if (!user || user == null) {
                  return done(null, false); 
            } else {
                  user.comparePassword(pass, function(err, isMatch) {
                        if (err) { return done(err); }
      
                        if (!isMatch) { return done(null, false); }
                        
                        return done(null, user);
                  });
            }
      });            
});



/* JWT token strategy - LOGIN automatically if token exists ("/", requireAuth, func(req, res) {..})
                              where requireAuth = passport.authenticate("jwt", {session: false})*/
const jwtOptions = {
      jwtFromRequest: function(req) {
            let token = null;
            if (req && req.cookies) {
                  token = req.cookies["_t1"];
            }
            return token;
      },
      //jwtFromRequest: ExtractJwt.fromHeader("authorization"), // returns extracted JWT token
      secretOrKey: process.env.JWT_SECRET
};

// JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
      
      // See if user payload exists in our db - if yes, call done w/user obj, else call done w/out a user object
      User.findById(payload.sub, function(err, user) {
            if (err) { return done(err, false); }

            if (user) { 
                  return done(null, user); 
            } else {
                  return done(null, false);
                  // or you could create a new account
            }
      });
});

// GITHUB STRATEGY
const gitHubStrategy = new GitHubStrategy({
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
     // User.findOrCreate({ githubId: profile.id }, function (err, user) {
     //   return cb(err, user);
     // });
    }
  );



passport.use(jwtLogin);
passport.use(localLogin);
//passport.use(gitHubStrategy)