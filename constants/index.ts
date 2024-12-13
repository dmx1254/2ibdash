import { Doc, Gender, Status } from "@/types";

export const GenderOptions = ["homme", "femme", "autre"];

export const PatientFormDefaultValues = {
  name: "",
  email: "",
  phone: "",
  bloodgroup: "",
  vaccination: "",
  birthDate: new Date(),
  gender: "homme" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  password: "",
  confirmPassword: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Carte d'identité nationale",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Acte de naissance",
  "Permis de conduire",
  "Carte d'assurance médicale/Police d'assurance",
  "Carte d'identité militaire",
  "Carte d'identité nationale",
  "Passeport",
  "Carte de résident permanent (Carte verte)",
  "Carte de sécurité sociale",
  "Carte d'identité d'État",
  "Carte d'identité étudiante",
  "Carte d'identité de votant",
];

export const Doctors: Doc[] = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
    speciality: "Généraliste",
    color: "#ef4444",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
    speciality: "Gynécologue",
    color: "#8b5cf6",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
    speciality: "Dermatologue",
    color: "#06b6d4",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
    speciality: "Ophtalmologue",
    color: "#3b82f6",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
    speciality: "Cardiologue",
    color: "#d946ef",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
    speciality: "Oncologue",
    color: "#6366f1",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
    speciality: "Dentiste",
    color: "#ec4899",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
    speciality: "Neurologue",
    color: "#f43f5e",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
    speciality: "Pédiatre",
    color: "#14b8a6",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

export const StatusOrder: { [key: string]: string } = {
  Payée: "/assets/icons/check.svg",
  Terminée: "/assets/icons/check.svg",
  "En attente": "/assets/icons/pending.svg",
  "En Cours de payment": "/assets/icons/process.svg",
  Annulée: "/assets/icons/cancelled.svg",
};
