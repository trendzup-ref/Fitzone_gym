import Admin from "../models/Admin.js";

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing");
    }

    const existingAdmin = await Admin.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const admin = await Admin.create({
      name: "Gym Admin",
      email: adminEmail,
      password: adminPassword,
    });

    console.log("Admin created successfully:", admin.email);

  } catch (error) {
    console.error("Admin creation failed:", error.message);
    throw error;
  }
};

export default createAdmin;