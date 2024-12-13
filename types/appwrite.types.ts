import { Gender, Status } from ".";

export interface Patient {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string;
  currentMedication: string;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

export interface Appointment {
  _id?: string;
  patient?: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason?: string;
  patientId?: string;
  phone?: string;
}

export interface AppointModal {
  _id?: string;
  userId: string;
  patientId?: string;
  primaryPhysician?: string;
  primaryPhysicianId: string;
  schedule: Date;
  status: Status;
  reason: string;
  note: string;
  cancellationReason?: string;
  name?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
