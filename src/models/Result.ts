import { Schema, model, models } from "mongoose";
import { BasePostFields } from "./BasePost";

const ResultSchema = new Schema(
  {
    ...BasePostFields,

    examName: String,
    resultDate: Date,
    resultLink: String,
    cutoffPDF: String,
  },
  { timestamps: true }
);

export default models.Result || model("Result", ResultSchema);
