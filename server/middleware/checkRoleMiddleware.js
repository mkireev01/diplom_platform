const jwt = require("jsonwebtoken");

module.exports = function (requiredRole = null) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      return next();
    }

    try {
     
      const authHeader = req.headers.authorization || '';
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      const token = parts[1];

    
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log(decoded);

   
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Нет доступа" });
      }

   
      req.user = decoded;
      next();

    } catch (err) {
      console.error('Auth middleware error:', err);
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }
  };
};
