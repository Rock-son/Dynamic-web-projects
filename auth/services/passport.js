"use strict"
const passport = require("passport"),
      User = require("../models/user"),
      secret = process.env.JWT_SECRET,
      JwtStrategy = require("passport-jwt").Strategy,
      ExtractJwt = require("passport-jwt").ExtractJwt,
      LocalStrategy = require("passport-local");



// Create local strategy - SIGNIN
const localOptions = {usernameField: "email"};

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
      // verify this email and password, call done w/ user if correct, else call don w/false
      User.findOne({email: email}, function(err, user) {
            if (err) { return done(err, false); }

            if (!user) { done(null, false); }

            user.comparePassword(password, function(err, isMatch) {
                  if (err) { return done(err); }

                  if (!isMatch) { return done(null, false); }

                  return done(null, user);
            });
      });            
});




// Setup options for JWT strategy - for register
const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: secret
};
// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
      // See if user payload exists in our db - if yes, call done w/user obj, else call done w/out a user object
      User.findById(payload.sub, function(err, user) {
            if (err) { return done(err, false); }

            if (user) { 
                  done(null, user); 
            } else {
                  done(null, false);
            }
      });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);