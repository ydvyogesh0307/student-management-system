import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name must be at most 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1, "Year must be between 1 and 4"],
      max: [4, "Year must be between 1 and 4"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
