"use strict"

const passport = require("passport"),
      User = require("../models/user"),
      JwtStrategy = require("passport-jwt").Strategy,
      ExtractJwt = require("passport-jwt").ExtractJwt,
      LocalStrategy = require("passport-local"),
      // SANITATION
      mongoSanitize = require("mongo-sanitize");



// LOCAL strategy - REGISTER with a password
const localOptions = {usernameField: "username"};

const localLogin = new LocalStrategy(localOptions, function(username, password, done) {
      // verify this email and password, call done w/ user if correct, else call don w/false
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
      requireAuth = passport.authenticate("jwt", {session: false})*/
const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
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

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);