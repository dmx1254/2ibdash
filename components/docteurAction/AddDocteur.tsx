"use client";

import React, { ChangeEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  createDoctor,
  updateMedicalePatient,
} from "@/lib/actions/patient.actions";
import { toast } from "sonner";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { E164Number } from "libphonenumber-js/core";
import { convertFileToBase64 } from "@/lib/utils";
import DocteurProfileUploader from "./DocteurProfileUploader";

const AddDocteur = () => {
  const [open, setOpen] = useState<boolean>(false);
  //   const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [picture, setPicture] = useState<File[] | undefined>();
  const [phone, setPhone] = useState<E164Number | undefined>();
  const [role, setRole] = useState<string>("DOCTOR");
  const [password, setPassword] = useState<string>("");
  const [speciality, setSpeciality] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(true);
  const [doctorStatus, setDoctorStatus] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  //   const file = values.identificationDocument[0];
  //   const base64 = await convertFileToBase64(file);

  //   formData = new FormData();
  //   formData.append("base64File", base64);
  //   formData.append("fileName", file.name);
  // identificationDocument: formData?.get("base64File") as string,

  const handleCreateDoctor = async () => {
    if (
      !name ||
      !picture ||
      !phone ||
      !password ||
      !speciality ||
      password !== confirmPassword
    ) {
      if (password !== confirmPassword) {
        toast.error(`Les mot de passes ne correspondent pas`, {
          style: {
            color: "#ef4444",
            background: "#0D0F10",
            border: "1px solid #363A3D",
          },
        });
      } else {
        toast.error(
          `Les champs Prenom et nom, Téléphone et Photo de profile ne doivent pas etre vide`,
          {
            style: {
              color: "#ef4444",
              background: "#0D0F10",
              border: "1px solid #363A3D",
            },
          }
        );
      }
    } else {
      const file = picture[0];
      const base64 = await convertFileToBase64(file);

      let formData;

      formData = new FormData();
      formData.append("base64File", base64);
      formData.append("fileName", file.name);

      const docteurData = {
        name,
        email,
        phone,
        role,
        isPhoneVerified,
        doctorStatus,
        isAdmin,
        profile: formData?.get("base64File") as string,
        password,
        speciality,
      };

      try {
        setIsCreating(true);
        const response = await createDoctor(docteurData);
        // console.log(response);

        if (response?.error) {
          toast.error(response.error, {
            style: {
              color: "#ef4444",
              background: "#0D0F10",
              border: "1px solid #363A3D",
            },
          });

          setIsCreating(false);
        } else if (response?.message) {
          toast.success(response.message, {
            style: {
              color: "#22c55e",
              background: "#0D0F10",
              border: "1px solid #363A3D",
            },
          });
          setIsCreating(false);
          setOpen(false);
        }
      } catch (error) {
        console.error(error);
        setIsCreating(false);
      }
    }
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <button
          className="fixed bottom-4 z-[30] bg-green-900 p-2 right-10 items-center justify-center border rounded border-green-500 text-green-400 transition-all hover:text-green-600"
          onClick={() => setOpen(true)}
          style={{
            boxShadow: "rgba(0, 180, 0, 0.35) 0px 5px 15px",
          }}
        >
          <Plus size={17} />
        </button>

        <AlertDialogContent className="bg-dark-200 border-dark-300 w-full max-sm:h-full overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm max-md:hidden self-start text-white/70">
              Ajouter un nouveau docteur
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="w-full flex flex-col items-start gap-4">
            <div className="w-full flex max-md:flex-col items-center gap-4 justify-between">
              <div className="w-full flex flex-col items-start gap-2">
                <Label>Prenom et nom</Label>
                <Input
                  type="text"
                  placeholder="Prenom et nom"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  className="bg-dark-400 placeholder:text-dark-600 border-dark-500"
                />
              </div>
              <div className="w-full flex flex-col items-start gap-2">
                <Label>Téléphone</Label>
                <PhoneInput
                  defaultCountry="SN"
                  international
                  withCountryCallingCode
                  name="phone"
                  label="Telephone"
                  placeholder="771234567"
                  value={phone as E164Number | undefined}
                  onChange={setPhone}
                  className="input-phone-add-docteur w-full"
                />
              </div>
            </div>
            <div className="w-full flex  max-md:flex-col items-center gap-4 justify-between">
              <div className="w-full flex flex-col items-start gap-2">
                <Label>Adresse E-mail</Label>
                <Input
                  type="email"
                  placeholder="docteur@example.com"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="bg-dark-400 placeholder:text-dark-600 border-dark-500"
                />
              </div>
              <div className="w-full flex flex-col items-start gap-2">
                <Label>Spécialité</Label>
                <Input
                  type="text"
                  placeholder="Pédiatre"
                  value={speciality}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSpeciality(e.target.value)
                  }
                  className="bg-dark-400 placeholder:text-dark-600 border-dark-500"
                />
              </div>
            </div>
            <div className="w-full flex flex-col items-start gap-2">
              <Label>Photo de profile</Label>
              <DocteurProfileUploader
                files={picture}
                onChange={setPicture}
                profile=""
              />
            </div>
            <div className="w-full flex flex-col items-start gap-2">
              <Label>Mot de passe</Label>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="bg-dark-400 placeholder:text-dark-600 border-dark-500"
              />
            </div>
            <div className="w-full flex flex-col items-start gap-2">
              <Label>Confirmation de mot de passe</Label>
              <Input
                type="password"
                placeholder="Confirmer mot de passe"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                className="bg-dark-400 placeholder:text-dark-600 border-dark-500"
              />
            </div>
          </div>

          <AlertDialogFooter className="flex flex-row justify-end gap-4">
            <button
              className="text-sm text-red-500 font-extrabold transition-all hover:opacity-80"
              onClick={() => setOpen(false)}
            >
              Annuler
            </button>
            <button
              className="text-sm text-green-500 font-extrabold transition-all hover:opacity-80"
              onClick={handleCreateDoctor}
            >
              {isCreating ? "en cours d'ajout..." : "Ajouer"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddDocteur;
