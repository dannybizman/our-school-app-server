const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const Teacher = require("../models/teacherModel");
const Parent = require("../models/parentModel");
const Student = require("../models/studentModel");

const authorizeRoles = (roles) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;

      // Check user model based on decoded.role
      switch (decoded.role) {
        case "admin":
          user = await Admin.findById(decoded.id).select("-password");
          break;
        case "teacher":
          user = await Teacher.findById(decoded.id).select("-password");
          break;
        case "parent":
          user = await Parent.findById(decoded.id).select("-password");
          break;
        case "student":
          user = await Student.findById(decoded.id).select("-password");
          break;
        default:
          return res.status(403).json({ success: false, message: "Unauthorized role." });
      }

      if (!user || !roles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Not authorized." });
      }

      req.user = {
        id: user._id,
        role: decoded.role,
        school: decoded.school, // if your token carries school info (as in your loginTeacher)
      };

      next();
    } catch (error) {
      console.error("Authorization error:", error);
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

