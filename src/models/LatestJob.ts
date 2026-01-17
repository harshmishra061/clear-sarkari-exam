import { Schema, model, models } from "mongoose";

const LatestJobSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    organization: { type: String, required: true },
    status: { type: String, enum: ["active", "expired"], default: "active" },
    postDate: { type: Date, default: Date.now },
    seo: {
      title: String,
      description: String,
    },

    vacancies: { type: Number, required: true },
    qualification: { type: String, required: true },
    ageLimit: { type: String, required: true },
    salary: { type: String, required: true },
    applyStartDate: { type: Date, required: true },
    applyEndDate: { type: Date, required: true },
    applyLink: { type: String, required: true },
    notificationPDF: String,
  },
  { timestamps: true }
);

export default models.LatestJob || model("LatestJob", LatestJobSchema);
