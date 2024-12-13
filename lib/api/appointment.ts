import { isValidObjectId } from "mongoose";
import { AppointmentUpdate, CreateAppointmentParams } from "@/types";
import { connectDB } from "../db";
import AppointmentModel from "../models/appointment.model";

import { parse, startOfDay, endOfDay, addDays, subDays } from "date-fns";

import { ibenModels } from "../models/ibendouma-models";
import { goapiModels } from "../models/ibytrade-models";

function parseDate(dateString: string): Date {
  return parse(dateString, "dd-MM-yyyy", new Date());
}

connectDB();

export async function createPatientAppointment(
  appointment: CreateAppointmentParams
) {
  try {
    const newAppointment = await AppointmentModel.create(appointment);
    return newAppointment;
  } catch (error) {
    console.log(error);
  }
}

export async function getPatientApppointment(appointmentId: string) {
  if (!isValidObjectId(appointmentId)) {
    throw new Error("Invalid appointment ID");
  }
  try {
    const appointment = await AppointmentModel.findById(appointmentId).sort({
      createdAt: -1,
    });
    return appointment;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserPatientAppointment(userId: string) {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }
  try {
    const usersAppointment = await AppointmentModel.find({ userId }).sort({
      updatedAt: -1,
    });
    return usersAppointment;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllOrdersAchatList(
  orderId: string,
  startDate: string,
  endDate: string,
  status: string,

  currentPage: number
) {
  const { BuyModel } = await goapiModels;
  let itemsPerPage: number = 8;
  const offset = (currentPage - 1) * itemsPerPage;

  const matchConditions: any = {};

  if (orderId && orderId.trim() !== "") {
    matchConditions.numBuy = { $regex: orderId, $options: "i" };
  }

  if (status && status.trim() !== "") {
    matchConditions.status = { $regex: status, $options: "i" };
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
    const totalDocuments = await BuyModel.countDocuments(matchConditions);

    const allOrdersAchatResult = BuyModel.aggregate([
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
    ]);

    const payedCountResult = BuyModel.countDocuments({
      ...matchConditions,
      status: "Payée",
    });

    const pendingCountResult = BuyModel.countDocuments({
      ...matchConditions,
      status: "En attente",
    });

    const cancelledCountResult = BuyModel.countDocuments({
      ...matchConditions,
      status: "Annulée",
    });

    const [orders, payedCountPa, pendingCountPa, cancelledCountPa] =
      await Promise.all([
        allOrdersAchatResult,
        payedCountResult,
        pendingCountResult,
        cancelledCountResult,
      ]);

    const allOrders = JSON.parse(JSON.stringify(orders));
    const payedCount = JSON.parse(JSON.stringify(payedCountPa));
    const pendingCount = JSON.parse(JSON.stringify(pendingCountPa));
    const cancelledCount = JSON.parse(JSON.stringify(cancelledCountPa));
    const totalPagesGet = JSON.parse(JSON.stringify(totalDocuments));

    const totalPages = Math.ceil(totalPagesGet / itemsPerPage);

    return {
      allOrders,
      payedCount,
      pendingCount,
      cancelledCount,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllOrdersVenteList(
  orderId: string,
  startDate: string,
  endDate: string,
  status: string,
  currentPage: number
) {
  const { OrderModelIben } = await ibenModels;
  let itemsPerPage: number = 8;
  const offset = (currentPage - 1) * itemsPerPage;

  const matchConditions: any = {};

  if (orderId && orderId.trim() !== "") {
    matchConditions.orderNum = { $regex: orderId, $options: "i" };
  }

  if (status && status.trim() !== "") {
    matchConditions.status = { $regex: status, $options: "i" };
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
    const totalDocuments = await OrderModelIben.countDocuments(matchConditions);

    const allOrdersVenteResult = OrderModelIben.aggregate([
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
    ]);

    const payedCountResult = OrderModelIben.countDocuments({
      ...matchConditions,
      status: "Terminée",
    });

    const pendingCountResult = OrderModelIben.countDocuments({
      ...matchConditions,
      status: "En attente",
    });

    const cancelledCountResult = OrderModelIben.countDocuments({
      ...matchConditions,
      status: "Annulée",
    });

    const [orders, payedCountPa, pendingCountPa, cancelledCountPa] =
      await Promise.all([
        allOrdersVenteResult,
        payedCountResult,
        pendingCountResult,
        cancelledCountResult,
      ]);

    const allOrders = JSON.parse(JSON.stringify(orders));
    const payedCount = JSON.parse(JSON.stringify(payedCountPa));
    const pendingCount = JSON.parse(JSON.stringify(pendingCountPa));
    const cancelledCount = JSON.parse(JSON.stringify(cancelledCountPa));
    const totalPagesGet = JSON.parse(JSON.stringify(totalDocuments));

    const totalPages = Math.ceil(totalPagesGet / itemsPerPage);

    return {
      allOrders,
      payedCount,
      pendingCount,
      cancelledCount,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllOrdersEchangeList(
  orderId: string,
  startDate: string,
  endDate: string,
  status: string,

  currentPage: number
) {
  const { ExchangeModel } = await goapiModels;
  let itemsPerPage: number = 8;
  const offset = (currentPage - 1) * itemsPerPage;

  const matchConditions: any = {};

  if (orderId && orderId.trim() !== "") {
    matchConditions.codeToExchange = { $regex: orderId, $options: "i" };
  }

  if (status && status.trim() !== "") {
    matchConditions.status = { $regex: status, $options: "i" };
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
    const totalDocuments = await ExchangeModel.countDocuments(matchConditions);

    const allOrdersEchangeResult = ExchangeModel.aggregate([
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
    ]);

    const payedCountResult = ExchangeModel.countDocuments({
      ...matchConditions,
      status: "Terminée",
    });

    const pendingCountResult = ExchangeModel.countDocuments({
      ...matchConditions,
      status: "En attente",
    });

    const cancelledCountResult = ExchangeModel.countDocuments({
      ...matchConditions,
      status: "Annulée",
    });

    const [echanges, payedCountPa, pendingCountPa, cancelledCountPa] =
      await Promise.all([
        allOrdersEchangeResult,
        payedCountResult,
        pendingCountResult,
        cancelledCountResult,
      ]);

    const allEchanges = JSON.parse(JSON.stringify(echanges));
    const payedCount = JSON.parse(JSON.stringify(payedCountPa));
    const pendingCount = JSON.parse(JSON.stringify(pendingCountPa));
    const cancelledCount = JSON.parse(JSON.stringify(cancelledCountPa));
    const totalPagesGet = JSON.parse(JSON.stringify(totalDocuments));

    const totalPages = Math.ceil(totalPagesGet / itemsPerPage);

    return {
      allEchanges,
      payedCount,
      pendingCount,
      cancelledCount,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createRate(rate: number) {
  try {
    const { RateModel } = await goapiModels;
    await RateModel.create({ rate: rate });
    return { message: "Taux d'échange créé avec succès" };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export async function updateRate(rate: number, rateId: string) {
  try {
    const { RateModel } = await goapiModels;
    await RateModel.findByIdAndUpdate(
      rateId,
      {
        $set: {
          rate: rate,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return { message: "Taux d'échange mis à jour avec succès" };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getRate() {
  try {
    const { RateModel } = await goapiModels;
    const rate = await RateModel.find();

    return rate;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function achatIbyUpdateStatus(status: string, achatId: string) {
  try {
    const { BuyModel } = await goapiModels;
    await BuyModel.findByIdAndUpdate(
      achatId,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return { message: "Status mis à jour avec succès" };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export async function exchangeUpdateStatus(status: string, echangeId: string) {
  try {
    const { ExchangeModel } = await goapiModels;
    await ExchangeModel.findByIdAndUpdate(
      echangeId,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return { message: "Status mis à jour avec succès" };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function venteIbenUpdateStatus(status: string, venteId: string) {
  try {
    const { OrderModelIben } = await ibenModels;
    await OrderModelIben.findByIdAndUpdate(
      venteId,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return { message: "Status mis à jour avec succès" };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateSingleAppointment(
  appointmentId: string,
  appointment: AppointmentUpdate
) {
  if (!isValidObjectId(appointmentId)) {
    throw new Error("Invalid appointment ID");
  }
  try {
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        primaryPhysician: appointment.primaryPhysician,
        schedule: appointment.schedule,
        status: appointment.status,
        cancellationReason: appointment.cancellationReason,
      },
      {
        new: true,
      }
    );
    return updatedAppointment;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteSingleAppointment(appointmentId: string) {
  if (!isValidObjectId(appointmentId)) {
    throw new Error("Invalid appointment ID");
  }

  try {
    const appointmentDel = await AppointmentModel.findByIdAndDelete(
      appointmentId
    );
    return appointmentDel;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function fiveRecentAppointments() {
  try {
    const recentFiveAppointment = await AppointmentModel.find()
      .sort({ updatedAt: -1 })
      .limit(5);

    return recentFiveAppointment;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllIbenOrdersCounts() {
  try {
    const { OrderModelIben } = await ibenModels;
    const totalOrders = await OrderModelIben.countDocuments();
    return totalOrders;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
