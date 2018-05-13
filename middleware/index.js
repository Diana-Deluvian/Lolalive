var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated() && req.user.admin){
        return next();
    }
    res.redirect('/');
};

module.exports = middlewareObj;