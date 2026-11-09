import Member from "../models/member.model.js";
import Membership from "../models/membership.model.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Cloudinary Image Upload Helper
const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "gym-members",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

// Calculate Membership Expiry Date
const calculateExpiryDate = (joinDate, months) => {
  const expiryDate = new Date(joinDate);
  const originalDay = expiryDate.getDate();

  expiryDate.setDate(1);
  expiryDate.setMonth(expiryDate.getMonth() + Number(months));

  const lastDay = new Date(
    expiryDate.getFullYear(),
    expiryDate.getMonth() + 1,
    0
  ).getDate();

  expiryDate.setDate(Math.min(originalDay, lastDay));

  return expiryDate;
};

// Validate MongoDB ObjectId
const isValidId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Add Member
export const addMember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      gender,
      joinDate,
      membership,
      payment,
    } = req.body;

    // Validate Required Fields
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !gender ||
      !joinDate ||
      !membership ||
      !payment
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check Duplicate Email
    const existingMember = await Member.findOne({
      email: normalizedEmail,
    });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: "Member with this email already exists.",
      });
    }

    // Check Membership Plan
    const membershipPlan = await Membership.findById(membership);

    if (!membershipPlan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found.",
      });
    }

    if (membershipPlan.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "This membership plan is inactive.",
      });
    }

    // Check Image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Member image is required.",
      });
    }

    // Validate Joining Date
    const selectedJoinDate = new Date(joinDate);

    if (isNaN(selectedJoinDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid joining date.",
      });
    }

    // Upload Image
    const imageResult = await uploadImage(req.file);

    // Calculate Expiry Date
    const expiryDate = calculateExpiryDate(
      selectedJoinDate,
      membershipPlan.month
    );

    // Create Member
    const member = await Member.create({
      name,
      email: normalizedEmail,
      phone,
      address,
      gender,
      membership,
      payment,
      image: imageResult.secure_url,
      joinDate: selectedJoinDate,
      membershipExpiryDate: expiryDate,
      status: expiryDate > new Date() ? "Active" : "Expired",
    });

    return res.status(201).json({
      success: true,
      message: "Member added successfully.",
      member,
    });

  } catch (error) {
    console.error("Add Member Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add member.",
    });
  }
};

// Get All Members
export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("membership")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get Members Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch members.",
    });
  }
};

// Get Single Member
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID.",
      });
    }

    const member = await Member.findById(id).populate("membership");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("Get Member Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch member.",
    });
  }
};

// Update Member
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      address,
      gender,
      membership,
      payment,
      joinDate,
    } = req.body;

    // Find existing member
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Check email duplication
    if (email && email !== member.email) {
      const existingMember = await Member.findOne({ email });

      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Update basic details
    if (name !== undefined) member.name = name;
    if (email !== undefined) member.email = email;
    if (phone !== undefined) member.phone = phone;
    if (address !== undefined) member.address = address;
    if (gender !== undefined) member.gender = gender;
    if (payment !== undefined) member.payment = payment;

    // Determine selected joining date
    let selectedJoinDate = member.joinDate;

    if (joinDate) {
      const [year, month, day] = joinDate.split("-").map(Number);

      selectedJoinDate = new Date(year, month - 1, day);

      if (isNaN(selectedJoinDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid joining date",
        });
      }
    }

    // Determine membership plan
    const currentMembershipId = member.membership.toString();
    const selectedMembershipId = membership || currentMembershipId;

    const membershipChanged =
      selectedMembershipId !== currentMembershipId;

    const joinDateChanged =
      joinDate &&
      selectedJoinDate.getTime() !== new Date(member.joinDate).getTime();

    // Recalculate expiry if membership or joining date changes
    if (membershipChanged || joinDateChanged) {
      const membershipPlan = await Membership.findById(
        selectedMembershipId
      );

      if (!membershipPlan) {
        return res.status(404).json({
          success: false,
          message: "Membership plan not found",
        });
      }

      // Check active status only when selecting a new plan
      if (membershipChanged && membershipPlan.status !== "Active") {
        return res.status(400).json({
          success: false,
          message: "Selected membership plan is not active",
        });
      }

      member.membership = selectedMembershipId;
      member.joinDate = selectedJoinDate;

      member.membershipExpiryDate = calculateExpiryDate(
        selectedJoinDate,
        membershipPlan.month
      );
    }

    // Upload new image if provided
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(
        req.file.path,
        {
          resource_type: "image",
        }
      );

      member.image = imageUpload.secure_url;
    }

    // Update membership status
    member.status =
      new Date(member.membershipExpiryDate) >= new Date()
        ? "Active"
        : "Expired";

    await member.save();

    return res.status(200).json({
      success: true,
      message: "Member updated successfully",
      member,
    });
  } catch (error) {
    console.error("Update Member Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Member
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID.",
      });
    }

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Member deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Member Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete member.",
    });
  }
};

// Search Members
export const searchMembers = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || !search.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search value is required.",
      });
    }

    const searchValue = search.trim().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const members = await Member.find({
      $or: [
        { name: { $regex: searchValue, $options: "i" } },
        { email: { $regex: searchValue, $options: "i" } },
        { phone: { $regex: searchValue, $options: "i" } },
      ],
    })
      .populate("membership")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Search Members Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search members.",
    });
  }
};

// Filter Members
export const filterMembers = async (req, res) => {
  try {
    const { gender, status, membership } = req.query;

    const filter = {};

    if (gender) filter.gender = gender;

    if (status) filter.status = status;

    if (membership) {
      if (!isValidId(membership)) {
        return res.status(400).json({
          success: false,
          message: "Invalid membership ID.",
        });
      }

      filter.membership = membership;
    }

    const members = await Member.find(filter)
      .populate("membership")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Filter Members Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to filter members.",
    });
  }
};