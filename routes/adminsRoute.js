const router = require("express").Router();
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const nodemailer = require("nodemailer");
const authorizeRoles = require("../middleware/authorizeRoles");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const Parent = require("../models/parentModel");
const School = require("../models/schoolModel");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Convert buffer to base64
const bufferToBase64 = (buffer) => {
  return `data:image/png;base64,${buffer.toString("base64")}`;
};


// Configure nodemailer
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.SMTP_MAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

module.exports = (upload) => {
  // Register new admin
  router.post("/register", upload.single("avatar"), async (req, res) => {
    try {
      const { username, firstName, lastName, email, schoolName, password, phoneNumber, address, sex, bloodType, birthday } = req.body;
      const avatar = req.file;
      console.log("Incoming form data:", req.body);
console.log("Avatar file:", req.file);
  
      if (!avatar) {
        return res.status(400).json({ success: false, message: "Avatar is required" });
      }
  
      if (!username || !firstName || !lastName ||  !email || !phoneNumber || !password || password.length < 6) {
        return res.status(400).json({ success: false, message: "All fields are required, and password must be at least 6 characters long." });
      }

      if (!schoolName) {
        return res.status(400).json({ success: false, message: "School name is required." });
      }
      
      const existingSchool = await School.findOne({ schoolName });
      if (existingSchool) {
        return res.status(400).json({ success: false, message: "A school with this name already exists." });
      }
      
  
      if (await Admin.findOne({ email })) {
        return res.status(400).json({ success: false, message: "User already exists." });
      }


      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Upload to Cloudinary using buffer data
      const uploadResult = await cloudinary.v2.uploader.upload(bufferToBase64(avatar.buffer), {
        folder: "user-avatars",
      });
  
      const avatarData = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
  
      console.log("Cloudinary Upload Result:", avatarData); // Debugging

      // Create new School document
const newSchool = new School({
  schoolName,
});
  
await newSchool.save();

      const newAdmin = new Admin({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        sex,
        school: newSchool._id,
        bloodType,
        birthday,
        avatar: avatarData,
        role: "admin",
      });
  
      await newAdmin.save();

      
newSchool.admin = newAdmin._id;
await newSchool.save();

      res.status(201).json({ success: true, message: "Admin registered successfully." });
  
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ success: false, message: error.message || "Server error." });
    }
  });
  
    
  // Admin Login
  router.post("/login",  async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email, role: "admin" }).populate("school");;

      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(400).json({ success: false, message: "Invalid credentials." });
      }

      const token = jwt.sign({ id: admin._id, role: admin.role, school: admin.school  }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ success: true, token, admin });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get logged-in admin
  router.get("/get-logged-in-admin", authorizeRoles(["admin"]), async (req, res) => {
    try {
      const admin = await Admin.findById(req.user.id).select("-password").populate("school");;
      res.json({ success: true, admin });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });


// Admin creates a Teacher
router.post("/create-teacher", authorizeRoles(["admin"]), upload.single("avatar"), async (req, res) => {
  try {
    const { username, firstName, lastName, email, phoneNumber, password, address, sex, bloodType, birthday, } = req.body;

    const avatar = req.file;
    console.log("Incoming form data:", req.body);
    console.log("Avatar file:", req.file);
      if (!avatar) {
      return res.status(400).json({ success: false, message: "Avatar is required." });
    }
    

    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      password.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, and password must be at least 6 characters long.",
      });
    } 
 
    // Normalize subjects and classes
let subjects = req.body.subjects;
let classes = req.body.classes;

if (subjects && !Array.isArray(subjects)) {
  subjects = [subjects];
}
if (classes && !Array.isArray(classes)) {
  classes = [classes];
}

    
  
    // Check if email already exists
    if (await Teacher.findOne({ email })) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    const school = req.user.school;

    const hashedPassword = await bcrypt.hash(password, 10);

      // Upload to Cloudinary using buffer data
      const uploadResult = await cloudinary.v2.uploader.upload(bufferToBase64(avatar.buffer), {
        folder: "teacher-avatars",
      });

    const avatarData = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };

     console.log("Cloudinary Upload Result:", avatarData); // Debugging

    const newTeacher = new Teacher({
      username,
      firstName,
      lastName,
      email,
      school,
      phoneNumber,
      password: hashedPassword,
      address,
      sex,
      birthday,
      bloodType,
      avatar: avatarData, 
      role: "teacher",
      subjects: subjects || [],
      classes: classes || [],
    });

    await newTeacher.save();
    console.log("Teacher Created:", newTeacher);
    res.status(201).json({ success: true, message: "Teacher account created successfully." });
  } catch (error) {
    console.error("Create Teacher Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });    
  }
});

// Admin creates a Student
router.post("/create-student", authorizeRoles(["admin", "teacher"]), upload.single("avatar"), async (req, res) => {
  try {
    const { username, firstName, lastName, password, address, sex, bloodType, classId, birthday } = req.body;
    const avatar = req.file;
    console.log("Incoming form data:", req.body);
    console.log("Avatar file:", req.file);
      if (!avatar) {
      return res.status(400).json({ success: false, message: "Avatar is required." });
    }
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username, and password are required." });
    }

    if (!classId) {
      return res.status(400).json({ success: false, message: "Class is required." });
    }    

    // Check if username already exists
    const existingUser = await Student.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already exists." });
    }
    const school = req.user.school;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload to Cloudinary using buffer data
    const uploadResult = await cloudinary.v2.uploader.upload(bufferToBase64(avatar.buffer), {
      folder: "student-avatars",
    });

  const avatarData = {
    public_id: uploadResult.public_id,
    url: uploadResult.secure_url,
  };

   console.log("Cloudinary Upload Result:", avatarData); // Debugging


    const newStudent = new Student({
      username,
      firstName,
      lastName,
      password: hashedPassword,
      address,
      sex,
      bloodType,
      classId,
      birthday,
      school,
      avatar: avatarData, 
      role: "student",
    });

    await newStudent.save();
  const populated = await newStudent.populate("classId");
    console.log("Student Created:", newStudent);
    res.status(201).json({ success: true, student:populated, message: "Student account created successfully." });
  } catch (error) {
    console.error("Create Student Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin creates a Parent
router.post("/create-parent", authorizeRoles(["admin", "teacher"]), upload.single("avatar"), async (req, res) => {
  try {
    const { username, firstName, lastName, email, phoneNumber, password, address, sex, birthday, } = req.body;
 
    const avatar = req.file;
    console.log("Incoming form data:", req.body);
    console.log("Avatar file:", req.file);
      if (!avatar) {
      return res.status(400).json({ success: false, message: "Avatar is required." });
    }
    

    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      password.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, and password must be at least 6 characters long.",
      });
    } 
 
        // Normalize students
let students = req.body.students;
if (students && !Array.isArray(students)) {
  students = [students];
}

   // Check if email already exists
   if (await Parent.findOne({ email })) {
    return res.status(400).json({ success: false, message: "User already exists." });
  }
  const school = req.user.school;
    const hashedPassword = await bcrypt.hash(password, 10);

       // Upload to Cloudinary using buffer data
       const uploadResult = await cloudinary.v2.uploader.upload(bufferToBase64(avatar.buffer), {
        folder: "parent-avatars",
      });

    const avatarData = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };

     console.log("Cloudinary Upload Result:", avatarData); // Debugging

    const newParent = new Parent({  
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      address,
      sex,
      birthday,
      school,
      avatar: avatarData,
      students: students || [],
      role: "parent",
    });
    

    await newParent.save();
    console.log("Parent Created:", newParent);
    res.status(201).json({ success: true, message: "Parent account created successfully." });
  } catch (error) {
    console.error("Create Parent Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

  return router;
};
