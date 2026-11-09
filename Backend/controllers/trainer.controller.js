import Trainer from "../models/trainer.model.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Validate MongoDB ObjectId
const isValidId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Upload Image to Cloudinary
const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "gym-trainers",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });
};

// Delete Image from Cloudinary
const deleteImage = async (publicId) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};

// Add Trainer
export const addTrainer = async (req, res) => {
  let uploadedImage;

  try {
    const {
  name,
  email,
  phone,
  gender,
  address,
  role,
  salary,
  joinDate,
} = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !role?.trim() ||
      !address?.trim() || 
      !gender||
      salary === undefined ||
      salary === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }



    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Trainer image is required.",
      });
    }

    if (!Number.isFinite(Number(salary)) || Number(salary) < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid salary.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingTrainer = await Trainer.findOne({
      email: normalizedEmail,
    });

    if (existingTrainer) {
      return res.status(409).json({
        success: false,
        message: "Trainer with this email already exists.",
      });
    }

    let trainerJoinDate = new Date();

    if (joinDate !== undefined) {
      trainerJoinDate = new Date(joinDate);

      if (Number.isNaN(trainerJoinDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid joining date.",
        });
      }
    }

    uploadedImage = await uploadImage(req.file);

    const trainer = await Trainer.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      role: role.trim(),
      salary: Number(salary),
      gender,
      address: address.trim(),
      joinDate: trainerJoinDate,
      image: uploadedImage.secure_url,
      imagePublicId: uploadedImage.public_id,
    });

    return res.status(201).json({
      success: true,
      message: "Trainer added successfully.",
      trainer,
    });
  } catch (error) {
    if (uploadedImage?.public_id) {
      await deleteImage(uploadedImage.public_id).catch(console.error);
    }

    console.error("Add Trainer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add trainer.",
    });
  }
};

// Get All Trainers
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: trainers.length,
      trainers,
    });
  } catch (error) {
    console.error("Get Trainers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trainers.",
    });
  }
};

// Get Trainer By ID
export const getTrainerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID.",
      });
    }

    const trainer = await Trainer.findById(id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      trainer,
    });
  } catch (error) {
    console.error("Get Trainer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trainer.",
    });
  }
};

// Update Trainer
export const updateTrainer = async (req, res) => {
  let uploadedImage;

  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      role,
      gender, address ,
      salary,
      joinDate,
      status,
    } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID.",
      });
    }

    const trainer = await Trainer.findById(id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
      });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Trainer name cannot be empty.",
        });
      }

      trainer.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Valid email is required.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingTrainer = await Trainer.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (existingTrainer) {
        return res.status(409).json({
          success: false,
          message: "Email already belongs to another trainer.",
        });
      }

      trainer.email = normalizedEmail;
    }

    if (phone !== undefined) {
      if (typeof phone !== "string" || !phone.trim()) {
        return res.status(400).json({
          success: false,
          message: "Phone number cannot be empty.",
        });
      }

      trainer.phone = phone.trim();
    }

    if (role !== undefined) {
      if (typeof role !== "string" || !role.trim()) {
        return res.status(400).json({
          success: false,
          message: "Trainer role cannot be empty.",
        });
      }

      trainer.role = role.trim();
    }

    if (gender !== undefined) {
  trainer.gender = gender;
}

if (address !== undefined) {
  trainer.address = address.trim();
}

    if (salary !== undefined) {
      if (
        salary === "" ||
        !Number.isFinite(Number(salary)) ||
        Number(salary) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid salary.",
        });
      }

      trainer.salary = Number(salary);
    }

    if (joinDate !== undefined) {
      const newJoinDate = new Date(joinDate);

      if (Number.isNaN(newJoinDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid joining date.",
        });
      }

      trainer.joinDate = newJoinDate;
    }

    if (status !== undefined) {
      if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid trainer status.",
        });
      }

      trainer.status = status;
    }

    // Update Image
    if (req.file) {
      uploadedImage = await uploadImage(req.file);

      const oldPublicId = trainer.imagePublicId;

      trainer.image = uploadedImage.secure_url;
      trainer.imagePublicId = uploadedImage.public_id;

      await trainer.save();

      // Delete old image after successful save
      await deleteImage(oldPublicId).catch(console.error);
    } else {
      await trainer.save();
    }

    return res.status(200).json({
      success: true,
      message: "Trainer updated successfully.",
      trainer,
    });
  } catch (error) {
    if (uploadedImage?.public_id) {
      await deleteImage(uploadedImage.public_id).catch(console.error);
    }

    console.error("Update Trainer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update trainer.",
    });
  }
};

// Delete Trainer
export const deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID.",
      });
    }

    const trainer = await Trainer.findById(id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
      });
    }

    await deleteImage(trainer.imagePublicId);

    await trainer.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Trainer deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Trainer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete trainer.",
    });
  }
};

// Search Trainers
export const searchTrainers = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search value is required.",
      });
    }

    const searchValue = search.trim().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const trainers = await Trainer.find({
      $or: [
        { name: { $regex: searchValue, $options: "i" } },
        { email: { $regex: searchValue, $options: "i" } },
        { phone: { $regex: searchValue, $options: "i" } },
        { role: { $regex: searchValue, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: trainers.length,
      trainers,
    });
  } catch (error) {
    console.error("Search Trainers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search trainers.",
    });
  }
};

// Filter Trainers
export const filterTrainers = async (req, res) => {
  try {
    const { role, status } = req.query;

    const filter = {};

    if (role) filter.role = role;

    if (status) {
      if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid trainer status.",
        });
      }

      filter.status = status;
    }

    const trainers = await Trainer.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: trainers.length,
      trainers,
    });
  } catch (error) {
    console.error("Filter Trainers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to filter trainers.",
    });
  }
};