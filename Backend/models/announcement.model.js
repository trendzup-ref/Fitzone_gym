import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Announcement description is required"],
      trim: true,
    },

    category: {
      type: String,
      enum: ["Important", "Offer", "Event"],
      default: "Important",
      required: true,
    },

    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model(
  "Announcement",
  announcementSchema
);

export default Announcement;