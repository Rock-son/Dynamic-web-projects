"use strict"


const passport = require("passport"),
      { LocalUser, GitHubUser, FacebookUser, GoogleUser} = require("../models/users"),
      GOOOGLE="google", FACEBOOK="facebook", GITHUB="github", LOCAL="local",
      JwtStrategy = require("passport-jwt").Strategy,
      GitHubStrategy = require('passport-github').Strategy,
      FacebookStrategy = require('passport-facebook').Strategy,
      GoogleStrategy = require('passport-google-oauth20').Strategy,
      ExtractJwt = require("passport-jwt").ExtractJwt,
      LocalStrategy = require("passport-local"),
      OAuth2Strategy = require("passport-oauth2"),
      // SANITIZATION
      mongoSanitize = require("mongo-sanitize"),
      xssFilters = require("xss-filters");



// LOCAL strategy - REGISTER with a password
const localOptions = {usernameField: "username"};

const localLogin = new LocalStrategy(localOptions, function(username, password, done) {
      // verify this email and password, call done w/ user if correct, else call done w/false
      const userName = xssFilters.inHTMLData(mongoSanitize(username)),
            pass = xssFilters.inHTMLData(mongoSanitize(password));
      LocalUser.findOne({username: userName}, function(err, user) {
            if (err) { return done(err, false); }

            if (!user || user == null) {
                  return done(null, false); 
            } else {
                  user.comparePassword(pass, function(err, isMatch) {
                        if (err) { return done(err); }
      
                        if (!isMatch) { return done(null, false); }
                        if (isMatch)  { return done(null, user);  }
                  });
            }
      });            
});



// JWT token strategy
const jwtOptions = {
      jwtFromRequest: function(req) {
            
            if (req && (req.cookies || {})["_t1"] != null) {
                  return req.cookies["_t1"];
            }
            return null;
      },
      //jwtFromRequest: ExtractJwt.fromHeader("authorization"), // returns extracted JWT token
      secretOrKey: process.env.JWT_SECRET
};

// JWT Strategy
/**
 * @param { Object } jwtOptions options for extracting token
 * @param { Object } payload returned object payload of JWT TOKEN
 * @param { Object } done function callback which appends req.user and makes a response
 */
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

      switch (payload.type || "") {
            case LOCAL:
                  LocalUser.findById(payload.sub, function(err, user) {
                        if (err) { return done(err, false);}
                        if (user) { return done(null, user); }
                        return done(null, false);
                  });
                  break;          
            case FACEBOOK:
                  FacebookUser.findById(payload.sub, function(err, user) {
                        if (err) { return done(err, false);}
                        if (user) { return done(null, user); }
                        return done(null, false);
                  });
                  break;
            case GITHUB:
                  GitHubUser.findById(payload.sub, function(err, user) {
                        if (err) { return done(err, false);}
                        if (user) { return done(null, user); }
                        return done(null, false);
                  });
                  break;
            case GOOGLE:
                  GoogleUser.findById(payload.sub, function(err, user) {
                        if (err) { return done(err, false);}
                        if (user) { return done(null, user); }
                        return done(null, false);
                  });
                  break;
            default:
                  return done(null, false);
                  break;
      }
});

// GITHUB STRATEGY
const gitHubStrategy = new GitHubStrategy({
      scope: "user:email",
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback"
      },
      function(accessToken, refreshToken, profile, done) {

            GitHubUser.findOne({userID: profile.id}, function(err, user) {
                  if (err) return done(err, false);
                  if (user) { return done(null, user); } 
                  
                  else {
                        GitHubUser.create({userID: profile.id, displayName: profile.displayName}, function(err, user) {
                              if (err) return done(err, false);
                              return done(null, user);
                        });
                  }
            });
    }
  );
// GOOGLE STRATEGY
const googleStrategy = new GoogleStrategy({
      scope: "profile",
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {

            GoogleUser.findOne({userID: profile.id}, function(err, user) {
                  if (err) return done(err, false);
                  if (user) { return done(null, user); } 
                  
                  else {
                        GoogleUser.create({userID: profile.id, displayName: profile.displayName}, function(err, user) {
                              if (err) return done(err, false);
                              return done(null, user);
                        });
                  }
            });
    }
  );
  
// FACEBOOK STRATEGY
const facebookStrategy = new FacebookStrategy({
      scope: "public_profile",
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ['id', 'displayName'],
      enableProof: true
      },
      function(accessToken, refreshToken, profile, done) {

            FacebookUser.findOne({userID: profile.id}, function(err, user) {
                  if (err) return done(err, false);
                  if (user) { return done(null, user); } 

                  else {
                        FacebookUser.create({userID: profile.id, displayName: profile.displayName}, function(err, user) {
                              if (err) return done(err, false);
                              return done(null, user);
                        });
                  }
            });
    }
  );




passport.use(jwtLogin);
passport.use(localLogin);
passport.use(gitHubStrategy)
passport.use(googleStrategy);
passport.use(facebookStrategy);