"use strict"

const {LocalUser} = require("../models/users"),
      jwt = require("jsonwebtoken"),
      mongoSanitize = require("mongo-sanitize"),
      cookieOptions = { httpOnly: true,
                        secure: false,
                        sameSite: true,
                        maxAge: 60 * 60 * 24000// 24 hours
      };


/**
 * 
 * @param {Object} user object with user data
 * @param {String} type schema type
 */
function tokenForUser(user, type) {
    
    const timestamp = new Date().getTime();
    
    return jwt.sign({ sub: user._id,
                      type: type,
                      iat: timestamp,
                      exp: timestamp + (3600000 * 24) // 24 hours
                    }, 
                      process.env.JWT_SECRET
                    );
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
exports.login = function(req, res, next) {   
    
    // User has already auth'd their email and password with verifyLogin - local strategy
    res.cookie("_t1", tokenForUser(req.user, "local"), cookieOptions);
    res.statusCode = 302;
    res.set({'Location': '/'});
    res.end();
    return;
};

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} user object with user data
 * @param {String} type schema type
 */
exports.schemaLogin = function(req, res, user, type) {   
    
    // User has already auth'd their email and password with verifyLogin - local strategy
    res.cookie("_t1", tokenForUser(user, type), cookieOptions);
    res.statusCode = 302;
    res.set({'Location': '/'});
    res.end();
    return;
};
/**
 * Logs out user, deleting his cookie
 * @param {Object} req 
 * @param {Object} res 
 */
exports.logout = function(req, res) {

    res.cookie("_t1", "", {
        httpOnly: true,
        secure: false,
        sameSite: true,
        maxAge: -1,
        exp: new Date(1).getTime()
    });
    res.statusCode = 302;
    res.set({'Location': req.headers.referer});
    res.end();
    return;
};


// LOCAL
/**
 * Registers user with LOCAL STRATEGY
 * @param { Object } req 
 * @param { Object } res 
 * @param { Object } next 
 */
exports.register = function(req, res, next) {

    const username = mongoSanitize(req.body.username),
          password = mongoSanitize(req.body.password),
          confirmPass = mongoSanitize(req.body.confirmPassword);
    
    if (!username || !password) {
        return res.status(422).send({error: "You must provide username and password!"});      
    } else if (password !== confirmPass) {
        return res.status(422).send({error: "Your passwords don't match!"});  
    }
    
    LocalUser.findOne({username: username}, function(err, existingUser) {
        if (err) { return next(err); }
    
        if (existingUser) {
            return res.status(422).send({error: "Username is in use"}); 
        }

        const user = new LocalUser({
            username: username,
            password: password
        });
        user.save(function(err) {
            if (err) { return next(err); }
            
            // send back a cookie with authentication token
            res.cookie('_t1', tokenForUser(user, "local"), cookieOptions);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
            return;
        });
    });
};