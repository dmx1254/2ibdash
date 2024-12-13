const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      default: new Date(Date.now()),
    },
    profile: {
      type: String,
      default: "", // Définir une valeur par défaut si nécessaire
    },
    gender: {
      type: String,
      enum: ["homme", "femme", "autre"],
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "",
    },
    emergencyContactName: {
      type: String,
      default: "",
    },
    emergencyContactNumber: {
      type: String,
      default: "",
    },
    primaryPhysician: {
      type: String,
      default: "",
    },
    insuranceProvider: {
      type: String,
      default: "",
    },
    insurancePolicyNumber: {
      type: String,
      default: "",
    },
    allergies: {
      type: String,
      default: "",
    },
    currentMedication: {
      type: String,
      default: "",
    },
    familyMedicalHistory: {
      type: String,
      default: "",
    },
    pastMedicalHistory: {
      type: String,
      default: "",
    },
    identificationType: {
      type: String,
      default: "",
    },
    speciality: {
      type: String,
      default: "",
    },
    identificationNumber: {
      type: String,
      default: "",
    },
    identificationDocument: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    privacyConsent: {
      type: Boolean,
      default: false,
    },
    treatmentConsent: {
      type: Boolean,
      default: false,
    },
    disclosureConsent: {
      type: Boolean,
      default: false,
    },
    isBan: {
      type: Boolean,
      default: false,
    },
    emailStringVerified: {
      type: String,
      default: "",
    },
    phoneStringVerified: {
      type: String,
      default: "",
    },
    bloodgroup: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "PATIENT",
    },
    doctorStatus: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    deviceUsed: {
      type: String,
      default: "",
    },
    lastConnexion: {
      type: String,
      default: "",
    },
    lastIpUsed: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const PatientModel =
  mongoose.models.patient || mongoose.model("patient", patientSchema);

export default PatientModel;
