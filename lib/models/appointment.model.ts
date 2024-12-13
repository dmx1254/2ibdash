const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    primaryPhysician: {
      type: String,
      required: true,
    },
    primaryPhysicianId: {
      type: String,
      default: "",
    },
    schedule: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    reason: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    note: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    cancellationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AppointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", AppointmentSchema);

export default AppointmentModel;
