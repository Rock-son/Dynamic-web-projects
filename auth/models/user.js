const mongoose = require("mongoose"),
      bcrypt = require("bcrypt-nodejs"),
      Schema = mongoose.Schema;

// Define Model
const userSchema = new Schema({
    // unique String.toLowerCase() - so no doubles are possible
    username: { type: Schema.Types.String, unique: true, lowercase: true },
    password: String
});



// On Save Hook, encrypt password with bcrypt
userSchema.pre("save", function(next) {
    
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




userSchema.methods.comparePassword = function(candidatePassword, callback) {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
        if (err) { return callback(err); }

        callback(null, isMatch);
    });
};

// Create Model Class from Schema and collection name
const ModelClass = mongoose.model("user", userSchema, "users");

// Export Model
module.exports = ModelClass;