const checkAuth = function(req, res, next) {
    if (req.isAuthenticated()) {
        ///next
        next();
    } else {
        res.redirect('/');
    }
}
module.exports = checkAuth;