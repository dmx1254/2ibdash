"use server";

import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";
import { iSEmailVerified, upadteEmailString } from "../api/patient";
import { generateVerificationCode } from "../utils";
import { revalidatePath } from "next/cache";

export async function verificationEmail(
  email: string,
  name: string,
  userId: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const codetoSend = generateVerificationCode();

  const { data, error } = await resend.emails.send({
    from: "Medicale Care <support@ibendouma.com>",
    to: [email],
    subject: "Vérification de votre adresse email",
    text: "",
    react: EmailTemplate({ codeVerification: codetoSend, userName: name }),
  });
  if (error) {
    console.log(error);
    return error;
  }

  //   return data;

  if (data && data.id) {
    const upatedStringEmail = await upadteEmailString(codetoSend, userId);
    return data;
  }
}

export async function isEmailIsVErified(codeVerif: string, userId: string) {
  const response = await iSEmailVerified(codeVerif, userId);

  if (response.errorMessage) {
    return response;
  }

  revalidatePath(`/patients/${userId}/profile`);
  return response;
}
