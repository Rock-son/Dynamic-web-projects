
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
          optsArr = Array.isArray( req.body.options ) ? req.body.options : [req.body.options], // check for HTTP POLLUTION
          options = optsArr.map(item => xssFilters.inHTMLData(mongoSanitize(item))).filter(val => val !== "").map(item => [item, 0]); // check & return items and votes (0) in array

    // CHECK FOR ARRAYS, WHERE THERE SHOULD BE NONE!
    createdBy = Array.isArray(createdBy) ? createdBy.slice(-1)[0] : createdBy;
    title = Array.isArray(title) ? title.slice(-1)[0] : title;

    // CHECK IF EMPTY
    if (!createdBy) {
        return res.redirect('/auth/login');  
    } else if ( !options.length || !title ) {
        return res.status( 422 ).send( { error: "Sent form must include at least one voting option and title!" } );
    }

    const data = Date.now().toString() + Math.random().toString(),
          url  = createHash("md5", data),
          poll = new PollSchema({
                    createdBy,
                    title,
                    options, 
                    url 
                });
                
    poll.save(function(err) {
        if (err) return next(err)
        
        return res.status(302).set({"Location": "./poll?url=" + poll.url}).end();
    });
};



// FOR VOTING SITE
exports.updatePollOptions = function(req, res, next, user) {

    let voted_index = parseInt(xssFilters.inHTMLData(mongoSanitize( req.body.voted || 0 ).trim())),
        shouldPollBeDeleted = !!xssFilters.inHTMLData(mongoSanitize(req.body.delete_poll || "")),
        newOption = xssFilters.inHTMLData(mongoSanitize( req.body.newOption || "" ).trim()),
        username = req.user ? (xssFilters.inHTMLData(req.user.username) || xssFilters.inHTMLData(req.user.displayName)) : null,
        id = xssFilters.uriComponentInHTMLData(mongoSanitize(req.body.poll));

    // TESTING FOR HTTP PARAMS POLLUTION
    voted_index = Array.isArray(voted_index) ? voted_index.slice(-1)[0] : voted_index;
    newOption = Array.isArray(newOption) ? newOption.slice(-1)[0] : newOption;
    id = Array.isArray(id) ? id.slice(-1)[0] : id;
    
    // DELETE, REJECT, UPDATE
    PollSchema.findById({_id: id}, function(err, poll) {
        if (err) next(err);


    // DELETE
        if (shouldPollBeDeleted) {
            if ( username === poll.createdBy ) {
                PollSchema.remove({_id: id}, function(err) {
                    if (err) next(err);
                    return res.status(302).set( { "Location": "./myPolls" } ).end();
                });
            } else {
                return res.status(302).set({"Location": "./poll?url=" + poll.url + "&err=" + xssFilters.uriComponentInDoubleQuotedAttr("You are not the owner of the poll!")}).end();
            }
        } else {
            
    // REJECT if too many OPTIONS
            if (poll.options.length >= 20 && newOption) {return res.status(302).set({"Location": "./poll?url=" + poll.url + "&err=" + xssFilters.uriComponentInDoubleQuotedAttr("The poll has exceeded max options (20) - no new options allowed!")}).end();}
            

    // UPDATE VOTE (anyone)
            if ( poll.options[voted_index] ) {
                if (searchArrayOfArrays(poll.usersVoted, 0, username) || searchArrayOfArrays(poll.usersVoted, 1, getClientIp(req)) ) {
                    return res.status(302).set({"Location": "./poll?url=" + poll.url + "&err=" + xssFilters.uriComponentInDoubleQuotedAttr("You have already voted!")}).end();
                }
                ++poll.options[voted_index][1];
                poll.usersVoted.push([username, getClientIp(req)]);
                
                PollSchema.update({_id: id}, poll, function(err) {
                    if (err) return next(err)
                    return res.status(302).set({"Location": "./poll?url=" + poll.url}).end();
                });
            } else if (newOption){


                
    // UPDATE NEW OPTION (CHECK EXISTENCE)
                if (searchArrayOfArrays(poll.options, 0, newOption)) {
                    const index = poll.options.map(item => item[0]).indexOf(newOption);
                    return res.status(302).set({"Location": "./poll?url=" + poll.url + "&err=" + xssFilters.uriComponentInDoubleQuotedAttr("Option already existed, no change was made!")}).end();
                } else {
                    poll.options.unshift([newOption, 0]);
                }
                
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
          check_err = xssFilters.inHTMLData(req.query.err || ""),
          check_chosen = xssFilters.inHTMLData(req.query.chosen || ""),
          url_error = check_err ? (Array.isArray(req.query.err || "") ? xssFilters.inHTMLData(req.query.err.slice(-1)[0]) : xssFilters.inHTMLData(req.query.err || "")) : null,
          chosenOption = check_chosen ? (Array.isArray(req.query.chosen || "") ? xssFilters.inHTMLData(req.query.chosen.slice(-1)[0]) : xssFilters.inHTMLData(req.query.chosen || "")) : null,
          id = xssFilters.uriComponentInHTMLData(mongoSanitize(url));
    
    PollSchema.findOne({url: id}, function(err, poll) {
        if (err) next(err);
        
        if (!poll) {
            return res.send({"error": "No poll with url: " + id + " found!"});
        }
        options.data = poll;        
        url_error != null ? (options.url_error = url_error) : null;
        chosenOption != null ? (options.chosen = chosenOption) : null;
        return res.render("poll", options);
    });
}




// SHOWING A USER HIS POLLS
exports.showMyPolls = function(req, res, next, options) {

    PollSchema.find(options.fetch, function(err, polls) {
        if (err) next(err);
        
        if (!polls) {
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