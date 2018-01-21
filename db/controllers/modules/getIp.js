"use strict"

module.exports = function(req) {
    return (req.headers['x-forwarded-for'] || "").split(',').pop() || req.connection.remoteAddress || 
    req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
};