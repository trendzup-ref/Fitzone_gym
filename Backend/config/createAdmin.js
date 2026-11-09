import Admin from "../models/Admin.js";

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check admin already exists
    const existingAdmin = await Admin.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    // Create admin
    const admin = await Admin.create({
      name: "Gym Admin",
      email: adminEmail,
      password: adminPassword,
    });

    console.log("Admin created successfully:", admin.email);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
  }
};

export default createAdmin;