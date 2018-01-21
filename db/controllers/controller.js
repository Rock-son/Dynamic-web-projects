const { PollSchema } = require("../models/poll"),
        mongoSanitize = require("mongo-sanitize"),
        createHash = require("./modules/_createHash"),
        xssFilters = require("xss-filters"),
        getClientIp = require("./modules/getIp"),
        // PASSPORT
        passport = require("passport");


// CREATE NEW POLL
exports.insertPollData = function(req, res, next) {

    let createdBy = xssFilters.inHTMLData(mongoSanitize( req.body.createdBy || "" ).trim()),
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
    
    // RETURN POLL DATA: delete, update or reject vote
    PollSchema.findById({_id: id}, function(err, poll) {
        if (err) next(err);
        
        if (shouldPollBeDeleted) {
            // ARCHIVE (only owner) TODO!!!!
            if ( username === poll.createdBy ) {
                PollSchema.remove({_id: id}, function(err) {
                    if (err) next(err);
                    return res.status(302).set( { "Location": "./myPolls" } ).end();
                });
            } else {
                return res.status( 422 ).send( { error: "You are not the owner of the poll and can therefore not delete it!" } );
            }
        } else {
            // UPDATE VOTE (anyone)
            if ( poll.options[voted_index]) {
                // IF USER ALREADY VOTED - TODO: reload with warning
                if (poll.usersVoted.map(item => item[0]).indexOf(req.user.username || "") > -1 || poll.usersVoted.map(item => item[1]).indexOf(getClientIp(req)) > -1 ) {
                    return res.status( 422 ).send( { error: "You have already voted!" } );
                }
                ++poll.options[voted_index][1];
                poll.usersVoted.push([req.user.username || 0, getClientIp(req)]);
                
                PollSchema.update({_id: id}, poll, function(err) {
                    if (err) return next(err)
                    return res.status(302).set({"Location": "./poll?url=" + poll.url}).end();
                });
            } else {                
                // UPDATE - AND VOTE WITH NEW OPTION
                poll.options.push([voted_index, 1]);
                poll.usersVoted.push([req.user.username || 0, getClientIp(req)]);
                PollSchema.update({_id: id}, poll, function(err) {
                    if (err) return next(err)
                    return res.status(302).set({"Location": "./poll?url=" + poll.url}).end();
                });
            }
        }    
    });
}


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



// SHOWING A USER HIS POLLS
exports.showMyPolls = function(req, res, next, options) {

    PollSchema.find(options.fetch, function(err, polls) {
        if (err) next(err);
        
        if (!polls.length) {
            return res.render("homePage", options);
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

/**
 * 
 * @param {[[any, any]]} arr - array of arrays [ [String, Number] ]
 * @param {Number} index - index of String value
 * @param {String} searchStr - String to search
 */
function searchArrayOfArrays(arr, index, searchStr) {
    
    if (!arr || !searchStr) {
        return false;
    }

    return !!arr.filter(val => val[index] === searchStr).length;
}