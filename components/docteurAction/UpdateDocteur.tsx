"use client";

import React, { ChangeEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FilePenLine } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { updateNewDoctor } from "@/lib/actions/patient.actions";
import { toast } from "sonner";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { E164Number } from "libphonenumber-js/core";
import { convertFileToBase64 } from "@/lib/utils";
import DocteurProfileUploader from "./DocteurProfileUploader";
import { Patient } from "@/types";

const UpdateDocteur = ({ data }: { data: Patient }) => {
  let phoneNumber = data.phone as E164Number;
  const [open, setOpen] = useState<boolean>(false);
  //   const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [name, setName] = useState<string>(data.name);
  const [email, setEmail] = useState<string>(data.email);
  const [picture, setPicture] = useState<File[] | undefined>();
  const [newPhone, setNewPhone] = useState<E164Number | undefined>(phoneNumber);
  const [speciality, setSpeciality] = useState<string>(data.speciality);

  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  //   const file = values.identificationDocument[0];
  //   const base64 = await convertFileToBase64(file);

  //   formData = new FormData();
  //   formData.append("base64File", base64);
  //   formData.append("fileName", file.name);
  // identificationDocument: formData?.get("base64File") as string,

  const handleCreateDoctor = async () => {
    let file;
    let formData;
    if (picture) {
      file = picture[0];
      const base64 = await convertFileToBase64(file);
      formData = new FormData();
      formData.append("base64File", base64);
      formData.append("fileName", file.name);
    }

    let newProfile = formData?.get("base64File") as string;

    let profile = newProfile ? newProfile : data.profile;

    let phone = newPhone ? newPhone : data.phone;

    const docteurDataUpdate = {
      name,
      email,
      phone,
      profile,
      speciality,
    };

    try {
      setIsUpdating(true);
      const updatedUser = await updateNewDoctor(data._id, docteurDataUpdate);
      if (updatedUser) {
        toast.success(
          `Le docteur ${updatedUser.name} a été mis jour avec succès`,
          {
            style: {
              color: "#22c55e",
              background: "#0D0F10",
              border: "1px solid #363A3D",
            },
          }
        );
        setIsUpdating(false);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <button
          className="flex items-center justify-center p-0.5 border rounded border-orange-300 text-orange-400 transition-all hover:text-orange-500"
          onClick={() => setOpen(true)}
        >
          <FilePenLine size={18} />
        </button>

        <AlertDialogContent className="bg-dark-200 border-dark-300 w-full max-sm:h-full overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm max-md:hidden self-start text-white/70">
              Mettre à jour les informations de{" "}
              <strong className="underline">{data.name}</strong>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="w-full flex flex-col items-start gap-4">
            <div className="w-full flex max-md:flex-col items-center gap-4 justify-between">
              <div className="w-full flex flex-col items-start gap-2">
                <Label>Prenom et nom</Label>
                <Input
                  type="text"
                  placeholder={data.name ? data.name : "Prenom et nom"}
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
                  placeholder={newPhone}
                  value={newPhone as E164Number | undefined}
                  onChange={setNewPhone}
                  className="input-phone-add-docteur w-full"
                />
              </div>
            </div>
            <div className="w-full flex  max-md:flex-col items-center gap-4 justify-between">
              <div className="w-full flex flex-col items-start gap-2">
                <Label>Adresse E-mail</Label>
                <Input
                  type="email"
                  placeholder={
                    data?.email ? data?.email : "docteur@example.com"
                  }
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
                  placeholder={
                    data?.speciality ? data?.speciality : "Spécialité"
                  }
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
                profile={data.profile}
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
              {isUpdating ? "En cours de mise à jour..." : "Mettre à jour"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UpdateDocteur;
