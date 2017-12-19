"use strict"

const passport = require("passport"),
      { LocalUser, GitHubUser, FacebookUser, GoogleUser, TwitterUser } = require("../models/users"),
      GOOOGLE="google", TWITTER="twitter", FACEBOOK="facebook", GITHUB="github", LOCAL="local",
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
      
      // See if user payload exists in db - if yes, call done w/user obj, else call done w/out a user object

      switch (payload.type) {
            case LOCAL:
                  LocalUser.findById(payload.sub, function(err, user) {
                        if (err) { return done(err, false);}
                        if (user) { return done(null, user); }
                        return done(null, false);
                  });
                  break;
            case TWITTER:
                  TwitterUser.findById(payload.sub, function(err, user) {
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

// GITHUB STRATEGY - just for registering, after that COOKIE & JWT STRATEGY
const gitHubStrategy = new GitHubStrategy({
      scope: "user:email",
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
          
      GitHubUser.findOne({userID: profile.id}, function(err, user) {
            if (err) return done(err, false);

            if (user) {
                  return done(null, user); 
            } else {
                  GitHubUser.create({userID: profile.id, displayName: profile.displayName}, function(err, user) {
                        if (err) return done(err, false);
                        return done(null, user);
                  });
            }
      });
    }
  );

  const googleStrategy = new GoogleStrategy({
      scope: "profile",
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {

      GoogleUser.findOne({userID: profile.id}, function(err, user) {
            if (err) return done(err, false);

            if (user) {
                  return done(null, user); 
            } else {
                  GoogleUser.create({userID: profile.id, displayName: profile.displayName}, function(err, user) {
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