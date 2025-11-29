import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import User from "../models/User";

async function seed() {
  try {
    console.log("🌱 Seeding database...");
    
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Create admin user
    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "Admin",
    });

    console.log("✅ Admin user created successfully");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Please change the password after first login");

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();

