const { PollSchema } = require("../models/poll"),
        mongoSanitize = require("mongo-sanitize"),
        createHash = require("./modules/_createHash"),
        xssFilters = require("xss-filters"),
        // PASSPORT
        passport = require("passport");


// CREATE NEW POLL
exports.insertPollData = function(req, res, next) {
    
    const createdBy = xssFilters.inHTMLData(mongoSanitize( req.body.createdBy || "" ).trim()),
          title = xssFilters.inHTMLData(mongoSanitize( req.body.poll_title || "" ).trim()),
          optsArr = Array.isArray( req.body.options ) ? req.body.options : [req.body.options],          
          options = optsArr.map( ( item ) => xssFilters.inHTMLData(mongoSanitize( item )) );
          
    // CHECK IF EMPTY
    if (createdBy == "") {
        return res.redirect('/auth/login');  
    } else if ( options.length === 0 || title === "" ) {
        return res.status( 422 ).send( { error: "Sent form must include at least one voting option and title!" } );
    }

    const data = Date.now().toString() + Math.random().toString(),
          opts = options.filter((item) => item !== "").map( (item) => [item, 0]),
          url  = createHash("md5", data),
          poll = new PollSchema({
                    createdBy,
                    title,
                    options: opts, 
                    url 
                });
                
    poll.save(function(err) {
        if (err) return next(err)
        
        return res.status(302).set({"Location": "./poll?url=" + poll.url}).end();
    });
};
// FOR VOTING SITE
exports.updatePollOptions = function(req, res, next) {
    
    return res.status( 422 ).send( { voted: req.body.voted, delete: req.body.delete_poll} );
    const title = xssFilters.inHTMLData(mongoSanitize( req.body.poll_title || "" ).trim()),
          optsArr = Array.isArray( req.body.options ) ? req.body.options : [req.body.options],          
          options = optsArr.map( ( item ) => xssFilters.inHTMLData(mongoSanitize( item )) );
          
    // CHECK IF EMPTY
    if (createdBy == "") {
        return res.redirect('/auth/login');  
    } else if ( options.length === 0 || title === "" ) {
        return res.status( 422 ).send( { error: "Sent form must include at least one voting option and title!" } );
    }

    const data = Date.now().toString() + Math.random().toString(),
          opts = options.filter((item) => item !== "").map( (item) => [item, 0]),
          url  = createHash("md5", data),
          poll = new PollSchema({
                    createdBy,
                    title,
                    options: opts, 
                    url 
                });
                
    poll.save(function(err) {
        if (err) return next(err)
        
        return res.status(302).set({"Location": "./poll?url=" + poll.url}).end();
    });
};

// RETURN DATA FOR SPECIFIC POLL (/poll?url=j73jhn3s...)
exports.managePollData = function(req, res, next, options) {
    
    const url = Array.isArray(req.query.url) ? req.query.url.slice(-1)[0] : req.query.url,
          id = xssFilters.uriComponentInHTMLData(mongoSanitize(url));
    
    PollSchema.findOne({url: id}, function(err, poll) {
        if (err) next(err);
        
        if (!poll) {
            return res.render({"error": "No poll with url: " + id + " found!"});
        }
        options.data =hideID(poll);
        return res.render("poll", options);
    });
}

// SHOWING A USER HIS POLLS
exports.showMyPolls = function(req, res, next, options) {

    PollSchema.find(options.fetch, function(err, polls) {
        if (err) next(err);
        
        if (!polls.length) {
            return res.render({"error": "No polls found!"});
        }
        options.polls =hideID(polls);
        return res.render("homePage", options);
    });
}

function hideID(json) {
        
    if (Array.isArray(json)) {

        json.forEach((poll,index) => {
            delete poll._doc._id;
            return poll._doc;
        });
    } else {
        delete json._doc._id;
        return json._doc;
    }
}