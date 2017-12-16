const mongoose = require("mongoose"),
      bcrypt = require("bcrypt-nodejs"),
      Schema = mongoose.Schema;

// Define Model
const localSchema = new Schema({
    // unique String.toLowerCase() - so no doubles are possible
    username: { type: Schema.Types.String, unique: true, lowercase: true },
    password: String
});
const gitHubSchema = new Schema({
    // unique String.toLowerCase() - so no doubles are possible
    id: { type: Schema.Types.String, unique: true, lowercase: true },
});


// On Save Hook, encrypt password with bcrypt
localSchema.pre("save", function(next) {
    
    const user = this; // user is an instance of userSchema - a context (this)
    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return next(err); }

            user.password = hash;
            next();  // e.g. saves the model
        });
    });
});




localSchema.methods.comparePassword = function(candidatePassword, callback) {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
        if (err) { return callback(err); }

        callback(null, isMatch);
    });
};

// Create Model Class from Schema and collection name
const LocalUser = mongoose.model("user", localSchema, "users");

// Export Model
module.exports.LocalUser = LocalUser;
//module.exports.GitHubUser = GithubUser;