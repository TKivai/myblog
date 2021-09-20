module.exports.isLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/users/login');
    }

    next();
}

module.exports.isLoggedOut = (req, res, next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/');
    }
    
    next();
}