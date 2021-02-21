let middleware = {};

middleware.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
      return next()
    }
    res.status(400).send("must be logged in");
}

module.exports = middleware;