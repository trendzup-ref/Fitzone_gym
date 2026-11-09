
import Inquiry from "../models/inquiry.model.js";

// Validate MongoDB ObjectId
const isValidId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const inquiryStatuses = ["Pending", "Contacted", "Resolved"];

const inquirySubjects = [
  "Membership Inquiry",
  "Personal Training",
  "Fitness Programs",
  "Other",
];

// Add Inquiry
export const addInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      !subject ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Subject validation
    if (!inquirySubjects.includes(subject)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry subject.",
      });
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject,
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("Add Inquiry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit inquiry.",
    });
  }
};

// Get All Inquiries
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    console.error("Get Inquiries Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries.",
    });
  }
};

// Get Inquiry By ID
export const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID.",
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.error("Get Inquiry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inquiry.",
    });
  }
};

// Update Inquiry
export const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      subject,
      message,
      status,
      adminNote,
    } = req.body;

    // Validate MongoDB ID
    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID.",
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    // Update name
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Valid customer name is required.",
        });
      }

      inquiry.name = name.trim();
    }

    // Update email
    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address.",
        });
      }

      inquiry.email = email.trim().toLowerCase();
    }

    // Update phone
    if (phone !== undefined) {
      if (typeof phone !== "string" || !phone.trim()) {
        return res.status(400).json({
          success: false,
          message: "Valid phone number is required.",
        });
      }

      inquiry.phone = phone.trim();
    }

    // Update subject
    if (subject !== undefined) {
      if (!inquirySubjects.includes(subject)) {
        return res.status(400).json({
          success: false,
          message: "Invalid inquiry subject.",
        });
      }

      inquiry.subject = subject;
    }

    // Update message
    if (message !== undefined) {
      if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: "Valid inquiry message is required.",
        });
      }

      inquiry.message = message.trim();
    }

    // Update status
    if (status !== undefined) {
      if (!inquiryStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid inquiry status.",
        });
      }

      inquiry.status = status;
    }

    // Update admin note
    if (adminNote !== undefined) {
      if (typeof adminNote !== "string") {
        return res.status(400).json({
          success: false,
          message: "Admin note must be a string.",
        });
      }

      inquiry.adminNote = adminNote.trim();
    }

    await inquiry.save();

    return res.status(200).json({
      success: true,
      message: "Inquiry updated successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("Update Inquiry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update inquiry.",
    });
  }
};

// Delete Inquiry
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID.",
      });
    }

    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Inquiry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete inquiry.",
    });
  }
};

// Search Inquiries
export const searchInquiries = async (req, res) => {
  try {
    const { search } = req.query;

    if (typeof search !== "string" || !search.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search value is required.",
      });
    }

    const searchValue = search.trim().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const inquiries = await Inquiry.find({
      $or: [
        { name: { $regex: searchValue, $options: "i" } },
        { email: { $regex: searchValue, $options: "i" } },
        { phone: { $regex: searchValue, $options: "i" } },
        { subject: { $regex: searchValue, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    console.error("Search Inquiries Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search inquiries.",
    });
  }
};

// Filter Inquiries
export const filterInquiries = async (req, res) => {
  try {
    const { status, subject } = req.query;

    const filter = {};

    if (status) {
      if (!inquiryStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid inquiry status.",
        });
      }

      filter.status = status;
    }

    if (subject) {
      if (!inquirySubjects.includes(subject)) {
        return res.status(400).json({
          success: false,
          message: "Invalid inquiry subject.",
        });
      }

      filter.subject = subject;
    }

    const inquiries = await Inquiry.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    console.error("Filter Inquiries Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to filter inquiries.",
    });
  }
};