import { isValidObjectId } from "mongoose";
import { DoctorCreating, UserRegister } from "@/types";
import PatientModel from "../models/patient.model";
import bcrypt from "bcrypt";
import { parseStringify } from "../utils";
import VisitModel from "../models/visit.model";
import { goapiModels } from "../models/ibytrade-models";

export async function getDocteurAndDetails() {
  try {
    const allDoctorsFind = PatientModel.find({ role: "DOCTOR" });

    const allDoctorsCountFind = PatientModel.countDocuments({ role: "DOCTOR" });

    const docteursInServiceCountFind = PatientModel.countDocuments({
      role: "DOCTOR",
      doctorStatus: true,
    });
    const docteursOutServiceCountFind = PatientModel.countDocuments({
      role: "DOCTOR",
      doctorStatus: false,
    });

    const [
      allDoctors,
      allDoctorsCount,
      docteursInServiceCount,
      docteursOutServiceCount,
    ] = await Promise.all([
      allDoctorsFind,
      allDoctorsCountFind,
      docteursInServiceCountFind,
      docteursOutServiceCountFind,
    ]);
    return {
      allDoctors,
      allDoctorsCount,
      docteursInServiceCount,
      docteursOutServiceCount,
    };
  } catch (error: any) {
    throw new Error(`Error to find doctors: ${error.message}`);
  }
}

export async function createNewDoctor(doctorData: DoctorCreating) {
  try {
    const isDocteurExist = await PatientModel.findOne({
      phone: doctorData.phone,
    });
    if (isDocteurExist)
      return {
        error: "Ce docteur avec ce numéro existe déjà",
        user: {},
        message: "",
      };

    const hashedPassword = await bcrypt.hash(doctorData.password, 10);
    const doctorCreated = {
      ...doctorData,
      gender: "autre",
      password: hashedPassword,
    };
    const newDoctor = await PatientModel.create(doctorCreated);
    const doctor = parseStringify(newDoctor);
    return {
      error: "",
      user: doctor,
      message: "Docteur créé avec succès",
    };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getActifDoctors() {
  try {
    const doctors = await PatientModel.find({
      role: "DOCTOR",
      doctorStatus: true,
    })
      .select("_id")
      .select("name")
      .select("speciality")
      .select("profile")
      .select("createdAt")
      .select("updatedAt");
    return doctors;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getDoctorsWithRemoveFields() {
  try {
    const doctors = await PatientModel.find({
      role: "DOCTOR",
    })
      .select("_id")
      .select("name")
      .select("speciality")
      .select("profile")
      .select("createdAt")
      .select("updatedAt");
    return doctors;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getIbyOrdersCount() {
  try {
    const { BuyModel } = await goapiModels;
    const ibyOrders = await BuyModel.countDocuments();

    return ibyOrders;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getActifDoctorsInPatientForm() {
  try {
    const isActifDoctors = await PatientModel.find({
      role: "DOCTOR",
      doctorStatus: true,
    })
      .select("_id")
      .select("name")
      .select("speciality")
      .select("profile")
      .select("createdAt")
      .select("updatedAt");
    return parseStringify(isActifDoctors);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getPatientsDevices() {
  try {
    const result = await PatientModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            deviceUsed: "$deviceUsed",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          devices: {
            $push: {
              device: "$_id.deviceUsed",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "January" },
                { case: { $eq: ["$_id", 2] }, then: "February" },
                { case: { $eq: ["$_id", 3] }, then: "March" },
                { case: { $eq: ["$_id", 4] }, then: "April" },
                { case: { $eq: ["$_id", 5] }, then: "May" },
                { case: { $eq: ["$_id", 6] }, then: "June" },
                { case: { $eq: ["$_id", 7] }, then: "July" },
                { case: { $eq: ["$_id", 8] }, then: "August" },
                { case: { $eq: ["$_id", 9] }, then: "September" },
                { case: { $eq: ["$_id", 10] }, then: "October" },
                { case: { $eq: ["$_id", 11] }, then: "November" },
                { case: { $eq: ["$_id", 12] }, then: "December" },
              ],
              default: "Unknown",
            },
          },
          desktop: {
            $reduce: {
              input: {
                $filter: {
                  input: "$devices",
                  as: "device",
                  cond: { $eq: ["$$device.device", "Desktop"] },
                },
              },
              initialValue: 0,
              in: { $add: ["$$value", "$$this.count"] },
            },
          },
          mobile: {
            $reduce: {
              input: {
                $filter: {
                  input: "$devices",
                  as: "device",
                  cond: { $eq: ["$$device.device", "Mobile"] },
                },
              },
              initialValue: 0,
              in: { $add: ["$$value", "$$this.count"] },
            },
          },
        },
      },
      { $sort: { month: 1 } },
    ]);

    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getDesktopVisits() {
  try {
    const result = await VisitModel.aggregate([
      // 1. Regrouper par mois
      {
        $group: {
          _id: { $month: "$createdAt" }, // Obtenir le mois à partir de `createdAt`
          desktop: { $sum: 1 }, // Compter le nombre de visites pour chaque mois
        },
      },
      // 2. Projeter (convertir) les mois en noms
      {
        $project: {
          _id: 0, // Supprimer l'ID par défaut
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "january" },
                { case: { $eq: ["$_id", 2] }, then: "february" },
                { case: { $eq: ["$_id", 3] }, then: "march" },
                { case: { $eq: ["$_id", 4] }, then: "april" },
                { case: { $eq: ["$_id", 5] }, then: "may" },
                { case: { $eq: ["$_id", 6] }, then: "june" },
                { case: { $eq: ["$_id", 7] }, then: "july" },
                { case: { $eq: ["$_id", 8] }, then: "august" },
                { case: { $eq: ["$_id", 9] }, then: "september" },
                { case: { $eq: ["$_id", 10] }, then: "october" },
                { case: { $eq: ["$_id", 11] }, then: "november" },
                { case: { $eq: ["$_id", 12] }, then: "december" },
              ],
              default: "unknown", // Cas par défaut
            },
          },
          desktop: 1, // Inclure le champ `desktop`
          fill: {
            $concat: [
              "var(--color-", // Préfixe pour les couleurs
              {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id", 1] }, then: "january" },
                    { case: { $eq: ["$_id", 2] }, then: "february" },
                    { case: { $eq: ["$_id", 3] }, then: "march" },
                    { case: { $eq: ["$_id", 4] }, then: "april" },
                    { case: { $eq: ["$_id", 5] }, then: "may" },
                    { case: { $eq: ["$_id", 6] }, then: "june" },
                    { case: { $eq: ["$_id", 7] }, then: "july" },
                    { case: { $eq: ["$_id", 8] }, then: "august" },
                    { case: { $eq: ["$_id", 9] }, then: "september" },
                    { case: { $eq: ["$_id", 10] }, then: "october" },
                    { case: { $eq: ["$_id", 11] }, then: "november" },
                    { case: { $eq: ["$_id", 12] }, then: "december" },
                  ],
                  default: "unknown",
                },
              },
              ")",
            ],
          },
        },
      },
      // 3. Trier par mois
      { $sort: { _id: 1 } },
    ]);

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}
