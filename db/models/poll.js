const mongoose = require("mongoose"),
      Schema = mongoose.Schema;

// Define Model
const pollSchema = new Schema({    
    
    createdBy:  { type: String, required: true },
    options:    { type: [ Schema.Types.Mixed ], required: true },
    usersVoted: { type: [String] },
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