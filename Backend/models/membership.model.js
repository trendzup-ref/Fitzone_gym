import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Membership name is required"],
      trim: true,
      unique: true,
    },

    month: {
      type: Number,
      required: [true, "Membership duration is required"],
      min: [1, "Duration must be at least 1 month"],
    },

    price: {
      type: Number,
      required: [true, "Membership price is required"],
      min: [0, "Price cannot be negative"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Membership = mongoose.model("Membership", membershipSchema);

export default Membership;