import { Schema, model, models } from "mongoose";

const LatestJobSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    organization: { type: String, required: true },
    description: { type: String, required: true },
    vacancy: { type: Number },
    totalViews: { type: Number, default: 0 },
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
    
    ageRange: [
      {
        title: { type: String, required: true },
        value: { type: String, required: true },
      }
    ],
    
    table: [{
      title: { type: String },
      columns: [{ type: String }],
      rows: [[{ type: String }]],
    }],
    
    importantLinks: [{
      label: { type: String, required: true },
      url: { type: String, required: true },
      buttonText: { type: String, default: "Click Here"},
      otherInfo: { type: String },
    }],
  },
  { timestamps: true }
);

export default models.LatestJob || model("LatestJob", LatestJobSchema);