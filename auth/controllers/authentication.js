"use strict"

const User = require("../models/user"),
      jwt = require("jwt-simple"),
      mongoSanitize = require("mongo-sanitize"),
      secret = process.env.JWT_SECRET;
      


    function tokenForUser(user) {
        const timestamp = new Date().getTime();
        return jwt.encode({ sub: user._id, iat: timestamp }, secret);  // "sub" as a subject & "iat" as in Issued at Time, config.secret as a signature
    }




exports.login = function(req, res, next) {

    // User has already auth'd their email and password, we just need to give them a token
    res.send({token: tokenForUser(req.user)});

};




exports.register = function(req, res, next) {

    const username = mongoSanitize(req.body.username),
          password = mongoSanitize(req.body.password),
          confirmPass = mongoSanitize(req.body.confirmPassword);
    
    if (!username || !password) {
        return res.status(422).send({error: "You must provide username and password!"});      
    } else if (password !== confirmPass) {
        return res.status(422).send({error: "Your passwords don't match!"});  
    }
    
    // see if a user exists
    User.findOne({username: username}, function(err, existingUser) {
        if (err) { return next(err); }
    
        // if (user.exists) return an error
        if (existingUser) {
            return res.status(422).send({error: "Username is in use"}); 
        }
        // if (!user.exists) => create new user
        const user = new User({
            username: username,
            password: password
        });
        user.save(function(err) {
            if (err) { return next(err); }
            console.log(this.password);
            // send back an authentication token
            res.json({token: tokenForUser(user)});
        });
    });
};