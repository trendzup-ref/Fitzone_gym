
import Member from "../models/member.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// =====================================
// GENERATE MEMBER JWT TOKEN
// =====================================

const generateMemberToken = (memberId) => {
  if (!process.env.MEMBER_JWT_SECRET) {
    throw new Error("MEMBER_JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id: memberId },
    process.env.MEMBER_JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// =====================================
// COOKIE OPTIONS
// =====================================

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// =====================================
// UPLOAD IMAGE TO CLOUDINARY
// =====================================

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "fitzone/members",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

// =====================================
// MEMBER REGISTER
// =====================================

export const registerMember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      address,
      password,
      confirmPassword,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !gender ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const member = await Member.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found. Please contact gym administration.",
      });
    }

    // Verify existing member using phone number
    const isMemberVerified = member.phone === normalizedPhone;

    if (!isMemberVerified) {
      return res.status(400).json({
        success: false,
        message: "Member details do not match our records",
      });
    }

    if (member.password) {
      return res.status(409).json({
        success: false,
        message: "Account already registered. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    member.password = hashedPassword;

    await member.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please login.",
    });

  } catch (error) {
    console.error("Member Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// =====================================
// MEMBER LOGIN
// =====================================

export const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const member = await Member.findOne({
      email: email.trim().toLowerCase(),
    })
      .select("+password")
      .populate("membership");

    if (!member || !member.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      member.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Expired members can also access their dashboard
    const token = generateMemberToken(member._id);

    const memberData = member.toObject();
    delete memberData.password;

    res.cookie("memberToken", token, cookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      member: memberData,
    });

  } catch (error) {
    console.error("Member Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// =====================================
// MEMBER LOGOUT
// =====================================

export const logoutMember = async (req, res) => {
  try {
    const options = cookieOptions();

    res.clearCookie("memberToken", {
      httpOnly: options.httpOnly,
      secure: options.secure,
      sameSite: options.sameSite,
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Member Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// =====================================
// UPDATE MEMBER PROFILE
// =====================================

export const updateMemberProfile = async (req, res) => {
  try {
    const memberId = req.member.id;

    const { name, phone, gender, address } = req.body;

    // Find logged-in member
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Validate required fields
    if (
      !name?.trim() ||
      !phone?.trim() ||
      !gender ||
      !address?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All profile fields are required",
      });
    }

    // Validate gender
    if (!["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender",
      });
    }

    // Update personal details
    member.name = name.trim();
    member.phone = phone.trim();
    member.gender = gender;
    member.address = address.trim();

    // Upload new image to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      member.image = result.secure_url;
    }

    await member.save();

    // Fetch updated member
    const updatedMember = await Member.findById(memberId)
      .select("-password")
      .populate("membership");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      member: updatedMember,
    });

  } catch (error) {
    console.error("Update Member Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};