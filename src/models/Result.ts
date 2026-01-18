import { Schema, model, models } from "mongoose";

const ResultSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "LatestJob",
      required: true,
      index: true,
    },

    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    publishDate: { type: Date, default: Date.now },
    totalViews: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    seo: {
      title: String,
      description: String,
    },

    importantDates: [{
      label: String,
      date: String,
    }],

    importantLinks: [{
      label: { type: String, required: true },
      url: { type: String, required: true },
      buttonText: { type: String, default: "View Result" },
      otherInfo: String,
    }],
  },
  { timestamps: true }
);

export default models.Result || model("Result", ResultSchema);
