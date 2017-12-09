"use strict"

const User = require("../models/user"),
      cookie = require("cookie"),
      jwt = require("jsonwebtoken"),
      mongoSanitize = require("mongo-sanitize"),
      secret = process.env.JWT_SECRET;
      


    function tokenForUser(user) {
        
        const timestamp = new Date().getTime();
        return jwt.sign({
                sub: user._id,
                iat: timestamp
            }, 
            secret, 
            { 
                expiresIn: "1h",
            }
        );  
    }




exports.login = function(req, res, next) {
    
    // User has already auth'd their email and password, we just need to give them a token
    res.set({'Set-Cookie': cookie.serialize('_t1', tokenForUser(mongoSanitize(req.body.username)), {
            httpOnly: true,
            secure: true,
            sameSite: true,
            maxAge: 60 * 60 * 24 * 7 // 1 week 
        })
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
            
            // send back a cookie with authentication token
            res.set({'Set-Cookie': cookie.serialize('_t1', tokenForUser(mongoSanitize(req.body.username)), {
                httpOnly: true,
                secure: true,
                sameSite: true,
                maxAge: 60 * 60 * 24 * 7 // 1 week 
                })
            });
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
            return;
        });
    });
};