module.exports.logged = function(req, res, next) {

        if (req.body) {
           console.log('CSP Violation: ', req.body)
        } else {
            console.log('CSP Violation: No data received!')
        }
        res.status(204).end()
};