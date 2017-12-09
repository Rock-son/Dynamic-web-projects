"use strict"

const User = require("../models/user"),
      //jwt = require("jsonwebtoken"),
      jwt = require("jsonwebtoken"),
      mongoSanitize = require("mongo-sanitize"),
      secret = process.env.JWT_SECRET;
      


    function tokenForUser(user) {
        
        const timestamp = new Date().getTime();
        return jwt.sign({
                sub: user._id,
                iat: timestamp,
                exp: timestamp + 3600000
            }, 
            secret
        );  
    }




exports.login = function(req, res, next) {   
    
    // User has already auth'd their email and password with verifyLogin - local strategy
    res.cookie("_t1", tokenForUser(req.user), {
            httpOnly: true,
            secure: false,
            sameSite: true,
            maxAge: 60 * 60 * 1000// 1 hour 
    });
    res.statusCode = 302;
    res.set({'Location': '/'});
    res.end();
    return;
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
    
    User.findOne({username: username}, function(err, existingUser) {
        if (err) { return next(err); }
    
        if (existingUser) {
            return res.status(422).send({error: "Username is in use"}); 
        }

        const user = new User({
            username: username,
            password: password
        });
        user.save(function(err) {
            if (err) { return next(err); }
            
            // send back a cookie with authentication token
            res.cookie('_t1', tokenForUser(user), {
                httpOnly: true,
                secure: false,
                sameSite: true,
                maxAge: 60 * 60 * 1000 // 1 hour
            });
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
            return;
        });
    });
};