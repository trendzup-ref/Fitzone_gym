import Membership from "../models/membership.model.js";
import Member from "../models/member.model.js";

// Validate MongoDB ObjectId
const isValidId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Add Membership
export const addMembership = async (req, res) => {
  try {
    const { name, month, price, description } = req.body;

    // Validate Required Fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      month === undefined ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, duration and price are required.",
      });
    }

    // Validate Duration
    if (!Number.isInteger(Number(month)) || Number(month) < 1) {
      return res.status(400).json({
        success: false,
        message: "Membership duration must be at least 1 month.",
      });
    }

    // Validate Price
    if (
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid membership price.",
      });
    }

    const normalizedName = name.trim();

    // Check Duplicate Membership
    const existingMembership = await Membership.findOne({
      name: normalizedName,
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: "Membership plan already exists.",
      });
    }

    // Create Membership
    const membership = await Membership.create({
      name: normalizedName,
      month: Number(month),
      price: Number(price),
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Membership created successfully.",
      membership,
    });
  } catch (error) {
    console.error("Add Membership Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create membership.",
    });
  }
};

// Get All Memberships
export const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: memberships.length,
      memberships,
    });
  } catch (error) {
    console.error("Get Memberships Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch memberships.",
    });
  }
};

// Get Single Membership
export const getMembershipById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership ID.",
      });
    }

    const membership = await Membership.findById(id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found.",
      });
    }

    return res.status(200).json({
      success: true,
      membership,
    });
  } catch (error) {
    console.error("Get Membership Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch membership.",
    });
  }
};

// Update Membership
export const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      month,
      price,
      description,
      status,
    } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership ID.",
      });
    }

    const membership = await Membership.findById(id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found.",
      });
    }

    // Update Name
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Membership name cannot be empty.",
        });
      }

      const normalizedName = name.trim();

      const existingMembership = await Membership.findOne({
        name: normalizedName,
        _id: { $ne: id },
      });

      if (existingMembership) {
        return res.status(409).json({
          success: false,
          message: "Membership name already exists.",
        });
      }

      membership.name = normalizedName;
    }

    // Update Duration
    if (month !== undefined) {
      if (!Number.isInteger(Number(month)) || Number(month) < 1) {
        return res.status(400).json({
          success: false,
          message: "Duration must be at least 1 month.",
        });
      }

      membership.month = Number(month);
    }

    // Update Price
    if (price !== undefined) {
      if (
        price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid price.",
        });
      }

      membership.price = Number(price);
    }

    // Update Description
    if (description !== undefined) {
      membership.description = description;
    }

    // Update Status
    if (status !== undefined) {
      if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid membership status.",
        });
      }

      membership.status = status;
    }

    await membership.save();

    return res.status(200).json({
      success: true,
      message: "Membership updated successfully.",
      membership,
    });
  } catch (error) {
    console.error("Update Membership Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update membership.",
    });
  }
};

// Delete Membership
export const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership ID.",
      });
    }

    const membership = await Membership.findById(id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found.",
      });
    }

    // Check if any member is using this plan
    const memberExists = await Member.findOne({
      membership: id,
    });

    if (memberExists) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete membership because members are using it.",
      });
    }

    await Membership.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Membership deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Membership Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete membership.",
    });
  }
};