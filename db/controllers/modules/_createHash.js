const crypto = require("crypto");


module.exports = function(alg, data, log) {

    const cs = crypto.createHash(alg).update(data).digest("hex");
    if (log != null) log(cs); 
    return cs;
};