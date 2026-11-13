import Announcement from "../models/announcement.model.js";

// ========================================
// CREATE ANNOUNCEMENT (ADMIN)
// ========================================
export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, category, status, expiryDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const announcement = await Announcement.create({
      title,
      description,
      category: category || "Important",
      status: status || "Published",
      expiryDate: expiryDate || null,
    });

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET ALL ANNOUNCEMENTS (ADMIN)
// ========================================
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      total: announcements.length,
      announcements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET ANNOUNCEMENT BY ID (ADMIN)
// ========================================
export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    return res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE ANNOUNCEMENT (ADMIN)
// ========================================
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// DELETE ANNOUNCEMENT (ADMIN)
// ========================================
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET PUBLISHED ANNOUNCEMENTS (MEMBER)
// ========================================
export const getPublishedAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      status: "Published",
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } },
      ],
    }).sort({
      publishedAt: -1,
    });

    return res.status(200).json({
      success: true,
      total: announcements.length,
      announcements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};