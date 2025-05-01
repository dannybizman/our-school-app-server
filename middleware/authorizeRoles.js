const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const authorizeRoles = (roles) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Admin.findById(decoded.id).select("-password");

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ success: false, message: "Not authorized." });
      }

     
      req.user = {
        id: user._id,
        role: user.role,
        school: user.school,
      };

      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid token." });
    }
  };
};

module.exports = authorizeRoles;




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

