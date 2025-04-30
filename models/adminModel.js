const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
   username: {
      type: String,
      required: true,
      trim: true,
      maxLength: 32,
    },
    firstName: {
      type: String,
      required: true, 
      trim: true,
      maxLength: 32,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    sex: { type: String, enum: ["MALE", "FEMALE"], required: true },

     bloodType: {
      type: String,
      trim: true,
    },
     birthday: {
      type: Date,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: false,
      },
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
