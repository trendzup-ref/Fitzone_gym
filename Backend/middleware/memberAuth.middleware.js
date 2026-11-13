import jwt from "jsonwebtoken";
import Member from "../models/member.model.js";

const memberAuth = async (req, res, next) => {
  try {
    // Get member token from cookie
    const token = req.cookies?.memberToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.MEMBER_JWT_SECRET
    );

    // Find logged-in member
    const member = await Member.findById(decoded.id)
      .select("-password")
      .populate("membership");

    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Member account not found",
      });
    }

    // Attach member to request
    req.member = member;

    next();

  } catch (error) {
    console.error("Member Authentication Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

export default memberAuth;