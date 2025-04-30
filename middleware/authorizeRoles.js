
const jwt = require("jsonwebtoken");

module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. Invalid or missing token." });
    }

    const token = authHeader.split(" ")[1];

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const userRole = verified.role;

      if (userRole !== "admin" && !allowedRoles.includes(userRole)) {
        return res.status(403).json({ success: false, message: "Access forbidden: insufficient permissions." });
      }

      req.user = verified;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
  };
};



// const jwt = require("jsonwebtoken");

// module.exports = (allowedRoles = []) => {
//   return (req, res, next) => {
//     const token = req.header("Authorization");
//     if (!token) {
//       return res.status(401).json({ success: false, message: "Access denied. No token provided." });
//     }

//     try {
//       const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      
//       // Always allow 'admin', otherwise check if user's role is in allowedRoles
//       if (verified.role !== "admin" && !allowedRoles.includes(verified.role)) {
//         return res.status(403).json({ success: false, message: "Access forbidden: insufficient permissions." });
//       }

//       req.user = verified;
//       next();
//     } catch (error) {
//       res.status(401).json({ success: false, message: "Invalid token." });
//     }
//   };
// };

