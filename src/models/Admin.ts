import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "super-admin"], default: "admin" },
  },
  { timestamps: true }
);

// Hash password before saving
AdminSchema.pre('save', async function(this: IAdmin) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const AdminModel = models.Admin || model<IAdmin>("Admin", AdminSchema);
export default AdminModel;
