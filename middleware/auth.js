exports.protect =  (req, res, next) =>{ 
    if (req.isAuthenticated())
     return next(); 
    res.redirect("/login"); 
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log(req.user);
      if (!roles.includes(req.user.role)) {
        res.redirect("/login"); 
      }
      next();
    };
  };