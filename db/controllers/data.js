import { basename } from "path";

const { PollSchema } = require("../models/poll"),
        mongoSanitize = require("mongo-sanitize"),
        crypto = require("crypto");




exports.insertFormData = function(req, res, next) {   
    
    const createdBy = mongoSanitize(req.body.createdBy || "").trim(),
          options   = mongoSanitize(req.body.options   || "").split(/[\s\n\,]/);

    // CHECK IF EMPTY
    if (createdBy == "") {

        res.statusCode = 302;
        res.set({'Location': '/auth/login'});
        return res.end();        
    } else if (options.length === 0) {

        return res.status(422).send({error: "Sent form must include at least one voting option!"});
    }

    const data = Date.now().toString() + Math.random().toString(),
          url  = crypto.createHash("md5").update(data).digest("hex"),
          poll = new PollSchema({ createdBy, options, url });

    poll.save(function(err) {
        if (err) return next(err)

        res.status(302).set({"Location": "/myPoll?" + this.url})
    });
};
