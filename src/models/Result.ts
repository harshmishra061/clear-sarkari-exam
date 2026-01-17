import { Schema, model, models } from "mongoose";

const ResultSchema = new Schema(
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

    examName: { type: String, required: true },
    resultDate: { type: Date, required: true },
    resultLink: { type: String, required: true },
    cutoffPDF: String,
  },
  { timestamps: true }
);

export default models.Result || model("Result", ResultSchema);
