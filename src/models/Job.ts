import { Schema, model, models } from "mongoose";
import { BasePostFields } from "./BasePost";

const JobSchema = new Schema(
  {
    ...BasePostFields,

    vacancies: Number,
    qualification: String,
    ageLimit: String,
    salary: String,

    applyStartDate: Date,
    applyEndDate: Date,
    applyLink: String,

    notificationPDF: String,
  },
  { timestamps: true }
);

export default models.Job || model("Job", JobSchema);
