const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    role: {
      type: String,
      enum: ["candidate", "hr", "admin"],
      default: "candidate",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);