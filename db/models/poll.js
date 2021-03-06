const mongoose = require("mongoose"),
      Schema = mongoose.Schema;

// Define Model
const pollSchema = new Schema({    
    
    createdBy:  { type: String, required: true, trim: true },
    title:      { type: String, required: true, trim: true},
    options:    { type: [ [String, Number] ], required: true, validate: [val => val.length <= 30, '{PATH} exceeds the limit of 30'], trim: true },
    usersVoted: { type: [[String, String]] },
    updatedUTC: { type: Date },
    createdUTC: { type: Date, default: Date.now },
    url:        { type: String }
});

// CHECK VOTE NR
pollSchema.pre("save", function(next) {

    this.updatedUTC = Date.now();
    return next();
});

module.exports.PollSchema = mongoose.model("PollSchema", pollSchema, "voting_polls");