import { Schema, model, models } from "mongoose";

const LatestJobSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    organization: { type: String, required: true },
    description: { type: String },
    postDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "expired"], default: "active" },
    seo: {
      title: String,
      description: String,
    },
    importantDates: [{
      label: { type: String, required: true },
      date: { type: String, required: true },
    }],
    
    applicationFee: [{
      category: { type: String, required: true },
      amount: { type: Number, required: true },
    }],
    
    ageRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    
    vacancies: {
      total: { type: Number, required: true },
      distribution: [{
        category: { type: String, required: true },
        count: { type: Number, required: true },
      }],
    },
    
    posts: [{
      title: { type: String, required: true },
      count: { type: Number, required: true },
      qualification: [String],
    }],
    
    importantLinks: [{
      label: { type: String, required: true },
      url: { type: String, required: true },
    }],
  },
  { timestamps: true }
);

export default models.LatestJob || model("LatestJob", LatestJobSchema);