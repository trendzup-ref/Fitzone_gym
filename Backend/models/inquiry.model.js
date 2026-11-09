import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    subject: {
      type: String,
      required: [true, "Inquiry subject is required"],
      enum: [
        "Membership Inquiry",
        "Personal Training",
        "Fitness Programs",
        "Other",
      ],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },

    adminNote: {
  type: String,
  default: "",
  trim: true,
},

    status: {
      type: String,
      enum: ["Pending", "Contacted", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;