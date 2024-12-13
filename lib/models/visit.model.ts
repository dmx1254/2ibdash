import mongoose, { Document, Schema } from "mongoose";

interface Visit extends Document {
  userId: string;
  ipAdress: string;
}

const visitSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    ipAdress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const VisitModel =
  mongoose.models.visit || mongoose.model<Visit>("visit", visitSchema);

export default VisitModel;
