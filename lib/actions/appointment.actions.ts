"use server";

import {
  formatDateTime,
  parseStringify,
} from "../utils";
import { revalidatePath } from "next/cache";
import { CreateAppointmentParams, UpdateAppointmentParams } from "@/types";
import {
  achatIbyUpdateStatus,
  createPatientAppointment,
  createRate,
  deleteSingleAppointment,
  exchangeUpdateStatus,
  fiveRecentAppointments,
  getAllIbenOrdersCounts,
  getPatientApppointment,
  getRate,
  getUserPatientAppointment,
  updateRate,
  updateSingleAppointment,
  venteIbenUpdateStatus,
} from "../api/appointment";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await createPatientAppointment(appointment);
    return parseStringify(newAppointment);
  } catch (error: any) {
    console.error(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await getPatientApppointment(appointmentId);
    return parseStringify(appointment);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserAppointments = async (userId: string) => {
  try {
    const userAppointment = await getUserPatientAppointment(userId);
    return parseStringify(userAppointment);
  } catch (error: any) {
    console.error(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
  phone,
}: UpdateAppointmentParams) => {
  try {
    // console.log(appointmentId, appointment);
    const updatedAppointment = await updateSingleAppointment(
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error("Rendez-vous introuvable");
    }

    // Utiliser JSON.stringify et JSON.parse pour le débogage
    const updatedAppStringified = JSON.stringify(updatedAppointment);
    const updatedAppParsed = JSON.parse(updatedAppStringified);
    await sendSMSNotification(
      phone,
      type,
      updatedAppParsed.schedule,
      updatedAppParsed.primaryPhysician,
      updatedAppParsed.cancellationReason
    );
    revalidatePath("/admin");
    return updatedAppParsed;
  } catch (error: any) {
    // Utiliser console.error pour une meilleure visibilité des erreurs
    console.error("Erreur lors de la mise à jour du rendez-vous:", error);
    console.error(error);
  }
};

export const deleteAppointment = async (appointmentId: string) => {
  try {
    const appointmentDeleted = await deleteSingleAppointment(appointmentId);
    revalidatePath("/admin");
    return parseStringify(appointmentDeleted);
  } catch (error: any) {
    console.error(error);
  }
};

const getAccessToken = async () => {
  const credentials = `${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`;
  const encodedCredentials = Buffer.from(credentials).toString("base64");

  const response = await fetch("https://api.orange.com/oauth/v3/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encodedCredentials}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch access token");
  }

  const data = await response.json();
  return data.access_token;
};

export const sendSMSNotification = async (
  phone: string,
  type: string,
  schedule: Date,
  primaryPhysician: string,
  cancellationReason: string
) => {
  const accessToken = await getAccessToken();
  try {
    const smsMessage = `Bonjour, c'est MedicaleCare.${
      type === "schedule"
        ? `Votre rendez-vous a été programmé le ${
            formatDateTime(schedule!).dateTime
          } avec le Dr. ${primaryPhysician}`
        : `Nous avons le regret de vous informer que votre rendez-vous a été annulé pour la raison suivante:${cancellationReason}`
    }`;

    const messageObject = {
      outboundSMSMessageRequest: {
        address: `tel:${phone}`,
        outboundSMSTextMessage: {
          message: smsMessage,
        },
        senderAddress: "tel:+221778417586",
        // senderName: "Medicalecare",
      },
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Utilisation du token
      },
      body: JSON.stringify(messageObject),
    };

    const response = await fetch(
      "https://api.orange.com/smsmessaging/v1/outbound/tel:+221778417586/requests",
      options
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur lors de l'envoi du SMS :", error);
      throw new Error("La requête SMS a échoué");
    }

    const data = await response.json();
    // console.log("SMS envoyé avec succès :", data);
  } catch (error: any) {
    console.log(error);
    console.error(error);
  }
};

export const getFiveRecentAppointments = async () => {
  try {
    const fiveRecentApps = await fiveRecentAppointments();
    return parseStringify(fiveRecentApps);
  } catch (error: any) {
    console.log(error);
    console.error(error);
  }
};

export const ibenOrdersCounts = async () => {
  try {
    const ibenCounts = await getAllIbenOrdersCounts();
    return parseStringify(ibenCounts);
  } catch (error) {
    console.error(error);
  }
};

export const createEchangeRate = async (rate: number) => {
  try {
    const response = await createRate(rate);
    return parseStringify(response);
  } catch (error) {
    console.error(error);
  }
};

export const updateEchangeRate = async (rate: number, rateId: string) => {
  try {
    const response = await updateRate(rate, rateId);
    revalidatePath("/dashboard/commandes/echanges");
    return parseStringify(response);
  } catch (error) {
    console.error(error);
  }
};

export const getEchangeRate = async () => {
  try {
    const response = await getRate();
    return parseStringify(response);
  } catch (error) {
    console.error(error);
  }
};

export const changeEchangeStatus = async (
  status: string,
  echangeId: string
) => {
  try {
    const response = await exchangeUpdateStatus(status, echangeId);
    revalidatePath("/dashboard/commandes/echanges");
    return parseStringify(response);
  } catch (error) {
    console.error(error);
  }
};

export const changeVenteStatus = async (status: string, venteId: string) => {
  try {
    const response = await venteIbenUpdateStatus(status, venteId);
    revalidatePath("/dashboard/commandes/ventes");
    return parseStringify(response);
  } catch (error) {
    console.error(error);
  }
};
