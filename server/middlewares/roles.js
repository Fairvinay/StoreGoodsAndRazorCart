const roles = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(401);
  throw new Error("You are not allowed to access this page");
};

export default roles;
