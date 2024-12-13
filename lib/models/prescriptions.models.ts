import mongoose, { Document, Schema } from "mongoose";

interface PatientType extends Document {
  name: string;
  age: number;
}

interface MedicamentType extends Document {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionType extends Document {
  patientId: string;
  patient: PatientType; // Utilisation du type Patient
  medications: MedicamentType[]; // Tableau de médicaments
  read: boolean;
}

const medicationSchema = new Schema<MedicamentType>({
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: "", // Valeur par défaut
  },
  instructions: {
    type: String,
    required: true,
  },
});

const patientSchema = new Schema<PatientType>({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number, // Le type doit être Number ici, pas String
    required: true,
  },
});

const prescriptionSchema = new Schema<PrescriptionType>(
  {
    patientId: {
      type: String,
      required: true,
    },
    patient: {
      type: patientSchema, // Sous-document du patient
      required: true,
    },
    medications: {
      type: [medicationSchema], // Tableau de médicaments (chaque médicament est un sous-document)
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Ajoute des champs createdAt et updatedAt automatiquement
  }
);

const PrescriptionModel =
  mongoose.models.Prescription ||
  mongoose.model<PrescriptionType>("Prescription", prescriptionSchema);

export default PrescriptionModel;
