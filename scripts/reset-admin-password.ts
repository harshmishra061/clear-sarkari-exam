import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Admin Schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "super-admin"], default: "admin" },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function resetPassword() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in .env.local");
      process.exit(1);
    }
    
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, { dbName: "clear-sarkari-exam" });
    console.log("✅ Connected to MongoDB Atlas");

    const email = "admin@clearsarkariexam.com";
    const newPassword = "admin123";

    // Find admin
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      console.error("❌ Admin user not found!");
      process.exit(1);
    }

    // Hash password manually (bypassing the pre-save hook)
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update directly without triggering pre-save hook
    await Admin.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    console.log("✅ Password reset successfully!");
    console.log("📧 Email:", email);
    console.log("🔑 New Password:", newPassword);
    console.log("\n⚠️  You can now login and change your password properly!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error resetting password:", error);
    process.exit(1);
  }
}

resetPassword();
