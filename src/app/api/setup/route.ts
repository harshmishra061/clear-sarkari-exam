import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ⚠️ SECURITY WARNING: DELETE THIS FILE AFTER CREATING ADMIN USER!
// This is a one-time setup route for initial deployment

export async function GET() {
  try {
    await connectDB();
    
    const AdminSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, enum: ["admin", "super-admin"], default: "admin" },
    });
    
    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
    
    // Check if admin exists
    const exists = await Admin.findOne({ email: "admin@clearsarkariexam.com" });
    if (exists) {
      return NextResponse.json({ 
        message: "✅ Admin already exists",
        note: "You can delete this API route now (src/app/api/setup/route.ts)"
      });
    }
    
    // Create admin
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await Admin.create({
      email: "admin@clearsarkariexam.com",
      password: hashedPassword,
      name: "Admin User",
      role: "super-admin",
    });
    
    return NextResponse.json({ 
      success: true,
      message: "✅ Admin created successfully!",
      credentials: {
        email: "admin@clearsarkariexam.com",
        password: "admin123"
      },
      warning: "⚠️ IMPORTANT: Delete this API route file immediately (src/app/api/setup/route.ts) and change the default password!"
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
