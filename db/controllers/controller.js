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

    // CHECK FOR ARRAYS, WHERE THERE SHOULD BE NONE!
    createdBy = Array.isArray(createdBy) ? createdBy.slice(-1)[0] : createdBy;
    title = Array.isArray(title) ? title.slice(-1)[0] : title;

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

    let voted_index = xssFilters.inHTMLData(mongoSanitize( req.body.voted || "" ).trim()),
        shouldPollBeDeleted = !!xssFilters.inHTMLData(mongoSanitize(req.body.delete_poll || "")),
        username = req.user.username,
        id = xssFilters.uriComponentInHTMLData(mongoSanitize(req.body.poll));

    // TESTING FOR HTTP PARAMS POLLUTION
    voted_index = Array.isArray(voted_index) ? voted_index.slice(-1)[0] : voted_index;
    id = Array.isArray(id) ? id.slice(-1)[0] : id;
    
    PollSchema.findById({_id: id}, function(err, poll) {
        if (err) next(err);
        
        if (shouldPollBeDeleted) {
            // DELETE POLL ONLY IF OWNER
            if ( username === poll.createdBy ) {
                PollSchema.remove({_id: id}, function(err) {
                    if (err) next(err);
                    return res.status(302).set( { "Location": "./myPolls" } ).end();
                });
            } else {
                return res.status( 422 ).send( { error: "You are not the owner of the poll and can therefore not delete it!" } );
            }
        // UPDATE IN CASE USER HASN'T VOTED - VOTE +1
        } else {
            if ( poll.options[voted_index]) {
                ++poll.options[voted_index][1];
                poll.usersVoted.push(req.user.username || req.connection.remoteAddress);
                
                PollSchema.update({_id: id}, poll, function(err) {
                    if (err) return next(err)
                    return res.status(302).set({"Location": "./poll?url=" + poll.url}).end();
                });
            } else {
                return res.status( 422 ).send( { error: "Option you voted for does not exist!" } );
            }
        }    
    });
}
    /*TODO form.js
                let txt;
                if (confirm("Are You sure!?")) {
                    txt = "You pressed OK!";
                } else {
                    txt = "You pressed Cancel!";
                }*/

// RETURN DATA FOR SPECIFIC POLL (/poll?url=j73jhn3s...)
exports.showPollData = function(req, res, next, options) {
    
    const url = Array.isArray(req.query.url) ? req.query.url.slice(-1)[0] : req.query.url,
          id = xssFilters.uriComponentInHTMLData(mongoSanitize(url));
    
    PollSchema.findOne({url: id}, function(err, poll) {
        if (err) next(err);
        
        if (!poll) {
            return res.render({"error": "No poll with url: " + id + " found!"});
        }
        options.data =poll;
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
        options.polls =polls;
        return res.render("homePage", options);
    });
}

function hideID(json) {
        
    if (Array.isArray(json)) {
        let result = [];
        json.forEach((poll,index) => {
            delete poll._doc._id;
            result.push(poll._doc);
        });
        return result;
    } else {
        delete json._doc._id;
        return json._doc;
    }
}