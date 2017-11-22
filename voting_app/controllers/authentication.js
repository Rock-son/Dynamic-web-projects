const User = require("../models/user"),
      jwt = require("jwt-simple"),
      config = require("../config") || process.env.CONFIG;


    function tokenForUser(user) {
        const timestamp = new Date().getTime();
        return jwt.encode({ sub: user._id, iat: timestamp }, config.secret);  // "sub" as a subject & "iat" as in Issued at Time, config.secret as a signature
    }




exports.signin = function(req, res, next) {

    // User has already auth'd their email and password, we just need to give them a token
    res.send({token: tokenForUser(req.user)});

};




exports.signup = function(req, res, next) {

    const email = req.body.email,
          password = req.body.password;
    
    if (!email || !password) {
        return res.status(422).send({error: "You must provide email and password!"});      
    }
    
    // see if a user exists
    User.findOne({email: email}, function(err, existingUser) {
        if (err) { return next(err); }
    
        // if (user.exists) return an error
        if (existingUser) {
            return res.status(422).send({error: "Email is in use"}); 
        }
        // if (!user.exists) => create new user
        const user = new User({
            email: email,
            password: password
        });
        user.save(function(err) {
            if (err) { return next(err); }

            // send back an authentication token
            res.json({token: tokenForUser(user)});
        });
    });
};