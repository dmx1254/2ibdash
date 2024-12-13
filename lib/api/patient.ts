import { isValidObjectId } from "mongoose";
import { DoctorUpdate, UserRegister } from "@/types";
import PatientModel from "../models/patient.model";
import bcrypt from "bcrypt";
import { parseStringify } from "../utils";

import { parse, startOfDay, endOfDay, addDays, subDays } from "date-fns";

function parseDate(dateString: string): Date {
  return parse(dateString, "dd-MM-yyyy", new Date());
}

import { ibenModels } from "../models/ibendouma-models";
import { goapiModels } from "../models/ibytrade-models";

export async function createPatient(patient: UserRegister) {
  try {
    const isExistingUser = await PatientModel.findOne({ email: patient.email });
    if (isExistingUser)
      return {
        error: "Cet utilisateur avec cet email existe déjà",
        user: {},
        message: "",
      };

    const isPhoneExist = await PatientModel.findOne({ phone: patient.phone });
    if (isPhoneExist)
      return {
        error: "Cet utilisateur avec ce numéro de téléphone existe déjà",
        user: {},
        message: "",
      };

    const hashedPassword = await bcrypt.hash(patient.password, 10);
    const newUser = {
      ...patient,
      password: hashedPassword,
    };
    const savedUser = await PatientModel.create(newUser);
    const newuser = parseStringify(savedUser);
    return {
      error: "",
      user: newuser,
      message: "Inscription réussie ! Bienvenue parmi nous.",
    };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function login(phone: string, password: string) {
  return {
    phone: phone,
    password: password,
  };
}

export async function getOnePatient(userId: string) {
  try {
    const patientGeting = await PatientModel.findById(userId).select(
      "-password"
    );
    const patient = parseStringify(patientGeting);
    return patient;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function upadteEmailString(codeEmail: string, userId: string) {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid appointment ID");
  }

  const upadtedUserEmailString = await PatientModel.findByIdAndUpdate(
    userId,
    {
      emailStringVerified: codeEmail,
    },
    {
      new: true,
    }
  );
  return upadtedUserEmailString;
}

export async function iSEmailVerified(codeVerif: string, userId: string) {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid appointment ID");
  }

  try {
    const isUpadtedUser = await PatientModel.findById(userId);
    const isAlreadyEmailVerified = isUpadtedUser.isEmailVerified;
    if (isAlreadyEmailVerified)
      return {
        successMessage: "Votre adresse E-mail est déjà vérifié",
        errorMessage: "",
      };

    const emailString = isUpadtedUser.emailStringVerified;
    if (emailString === codeVerif) {
      const upadtedIsVerifEmail = await PatientModel.findByIdAndUpdate(
        userId,
        {
          isEmailVerified: true,
        },
        {
          new: true,
        }
      );
      return {
        successMessage: "Votre adresse E-mail a été vérifié avec succès",
        errorMessage: "",
      };
    } else {
      return {
        successMessage: "",
        errorMessage: "Le code que vous avez saisi est incorrect",
      };
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getCustomers(
  email: string,
  startDate: string,
  endDate: string,
  currentPage: number
) {
  const { UserIbenModel } = await ibenModels;

  let itemsPerPage: number = 8;
  const offset = (currentPage - 1) * itemsPerPage;

  const matchConditions: any = {};

  if (email && email.trim() !== "") {
    matchConditions.email = { $regex: email, $options: "i" };
  }

  if (startDate || endDate) {
    matchConditions.createdAt = {};

    if (startDate) {
      const parsedStartDate = parseDate(startDate);
      matchConditions.createdAt.$gte = startOfDay(parsedStartDate);
    }

    if (endDate) {
      const parsedEndDate = parseDate(endDate);
      matchConditions.createdAt.$lte = endOfDay(parsedEndDate);
    }
  }

  try {
    const totalDocuments = await UserIbenModel.countDocuments(matchConditions);

    const usersFinding = UserIbenModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: offset,
      },
      {
        $limit: itemsPerPage,
      },
      {
        $project: {
          password: 0, // Exclut le champ 'password'
          isAdmin: 0, // Exclut le champ 'identificationDocument'
        },
      },
    ]);

    const allUsersCount = UserIbenModel.countDocuments({
      ...matchConditions,
      isAdmin: false,
    });

    const allUsersBan = UserIbenModel.countDocuments({
      ...matchConditions,
      isBan: true,
      isAdmin: false,
    });
    const allUsersActif = UserIbenModel.countDocuments({
      ...matchConditions,
      isBan: false,
      isAdmin: false,
      online: true,
    });

    const [allUsers, usersCountAll, usersBanAll, usersActifAll] =
      await Promise.all([
        usersFinding,
        allUsersCount,
        allUsersBan,
        allUsersActif,
      ]);
    const users = JSON.parse(JSON.stringify(allUsers));
    const usersCount = JSON.parse(JSON.stringify(usersCountAll));
    const usersBan = JSON.parse(JSON.stringify(usersBanAll));
    const usersActif = JSON.parse(JSON.stringify(usersActifAll));
    const totalPagesGet = JSON.parse(JSON.stringify(totalDocuments));

    const totalPages = Math.ceil(totalPagesGet / itemsPerPage);

    return { users, usersCount, usersBan, usersActif, totalPages };
  } catch (error: any) {
    console.error(`Error fetching users: ${error}`);
  }
}

export async function deleteOneUser(userId: string) {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid User ID");
  }
  try {
    const { UserIbenModel } = await ibenModels;
    const userDeleted = await UserIbenModel.findByIdAndDelete(userId);
    return userDeleted;
  } catch (error: any) {
    throw new Error(`Error to deleting user: ${error.message}`);
  }
}

export async function BanOneUser(userId: string) {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }
  try {
    const { UserIbenModel } = await ibenModels;
    const userBan = await UserIbenModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          isBan: true,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return userBan;
  } catch (error: any) {
    throw new Error(`Error to ban user: ${error.message}`);
  }
}

export async function deBanOneUser(userId: string) {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }
  try {
    const { UserIbenModel } = await ibenModels;
    const userDeban = await UserIbenModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          isBan: false,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return userDeban;
  } catch (error: any) {
    throw new Error(`Error to deban user: ${error.message}`);
  }
}

export async function UpdatePatientMedi(
  patientId: string,
  bloodgroup: string,
  insuranceProvider: string,
  insurancePolicyNumber: string,
  allergies: string,
  primaryPhysician: string
) {
  if (!isValidObjectId(patientId)) {
    throw new Error("Invalid appointment ID");
  }
  try {
    const medicalPatientUpdate = await PatientModel.findByIdAndUpdate(
      patientId,
      {
        bloodgroup,
        insuranceProvider,
        insurancePolicyNumber,
        allergies,
        primaryPhysician,
      },
      {
        new: true,
      }
    );
    return medicalPatientUpdate;
  } catch (error: any) {
    throw new Error(`Error to update medicale patient: ${error.message}`);
  }
}

export async function deleteOneDoctor(patientId: string) {
  if (!isValidObjectId(patientId)) {
    throw new Error("Invalid appointment ID");
  }
  try {
    const doctorDeleted = await PatientModel.findByIdAndDelete(patientId);
    return doctorDeleted;
  } catch (error: any) {
    throw new Error(`Error to deleting patient: ${error.message}`);
  }
}

export async function deleteOneOrderEchange(echangeId: string) {
  if (!isValidObjectId(echangeId)) {
    throw new Error("Invalid echange ID");
  }
  try {
    const { ExchangeModel } = await goapiModels;
    const orderDeleted = await ExchangeModel.findByIdAndDelete(echangeId);
    return orderDeleted;
  } catch (error: any) {
    throw new Error(`Error to deleting echange: ${error.message}`);
  }
}

export async function deleteOneOrderBuy(orderId: string) {
  if (!isValidObjectId(orderId)) {
    throw new Error("Invalid echange ID");
  }
  try {
    const { BuyModel } = await goapiModels;
    const orderDeleted = await BuyModel.findByIdAndDelete(orderId);
    return orderDeleted;
  } catch (error: any) {
    throw new Error(`Error to deleting order: ${error.message}`);
  }
}
export async function deleteOneOrderVente(orderId: string) {
  if (!isValidObjectId(orderId)) {
    throw new Error("Invalid echange ID");
  }
  try {
    const { OrderModelIben } = await ibenModels;
    const orderDeleted = await OrderModelIben.findByIdAndDelete(orderId);
    return orderDeleted;
  } catch (error: any) {
    throw new Error(`Error to deleting order: ${error.message}`);
  }
}

export async function updateOneSingleDoctor(
  patientId: string,
  doctorDataUpdate: DoctorUpdate
) {
  if (!isValidObjectId(patientId)) {
    throw new Error("Invalid appointment ID");
  }
  try {
    const doctorUpdated = await PatientModel.findByIdAndUpdate(
      patientId,
      doctorDataUpdate,
      {
        new: true,
      }
    );
    return doctorUpdated;
  } catch (error: any) {
    throw new Error(`Error to updating doctor: ${error.message}`);
  }
}

export async function updateSingleDoctorStatus(
  patientId: string,
  doctorStatus: boolean
) {
  if (!isValidObjectId(patientId)) {
    throw new Error("Invalid appointment ID");
  }
  try {
    const doctorStatusUpdated = await PatientModel.findByIdAndUpdate(
      patientId,
      {
        doctorStatus,
      },
      {
        new: true,
      }
    );
    return doctorStatusUpdated;
  } catch (error: any) {
    throw new Error(`Error to updating doctor status: ${error.message}`);
  }
}

export async function getAllUsersCounts() {
  const { UserIbenModel } = await ibenModels;
  try {
    const totalUsers = await UserIbenModel.countDocuments({
      isAdmin: false,
    });
    return totalUsers;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
