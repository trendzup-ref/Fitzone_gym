import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Trainer name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    role: {
      type: String,
      required: [true, "Trainer role is required"],
      trim: true,
    },

    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },

    joinDate: {
      type: Date,
      default: Date.now,
    },

    image: {
      type: String,
      required: [true, "Trainer image is required"],
    },

    imagePublicId: {
      type: String,
      required: [true, "Image public ID is required"],
    },

    gender: {
  type: String,
  enum: ["Male", "Female", "Transgender"],
  required: [true, "Gender is required"],
},

address: {
  type: String,
  required: [true, "Address is required"],
  trim: true,
},

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Trainer = mongoose.model("Trainer", trainerSchema);

export default Trainer;