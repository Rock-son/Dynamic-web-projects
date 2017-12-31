const { PollSchema } = require("../models/poll"),
        mongoSanitize = require("mongo-sanitize"),
        createHash = require("./_createHash");



exports.insertFormData = function(req, res, next) {   
    
    const createdBy = mongoSanitize(req.body.createdBy || "").trim(),
          options   = mongoSanitize(req.body.options   || "").split(/[\n\r]/);

    // CHECK IF EMPTY
    if (createdBy == "") {
        return res.redirect('/auth/login');  
    } else if (options.length === 0) {
        return res.status(422).send({error: "Sent form must include at least one voting option!"});
    }

    const data = Date.now().toString() + Math.random().toString(),
          opts = options.filter((item) => item !== "").map( (item) => [item, 0]),
          url  = createHash("md5", data),
          poll = new PollSchema({ 
                    createdBy, 
                    options: opts, 
                    url 
                });
                
    poll.save(function(err) {
        if (err) return next(err)
        
        return res.status(302).set({"Location": "/poll?" + poll.url}).end();
    });
};
