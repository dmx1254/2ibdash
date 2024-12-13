import React, { ChangeEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FilePenLine } from "lucide-react";
import { Patient } from "@/types";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Doctors } from "@/constants";
import Image from "next/image";
import { updateMedicalePatient } from "@/lib/actions/patient.actions";
import { toast } from "sonner";

const UpdatePatient = ({ data }: { data: Patient }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [bloodgroup, setBloodgroup] = useState<string>(data.bloodgroup);
  const [insuranceProvider, setInsuranceProvider] = useState<string>(
    data.insuranceProvider
  );
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState<string>(
    data.insurancePolicyNumber
  );
  const [allergies, setAllergies] = useState<string>(data.allergies);
  const [primaryPhysician, setPrimaryPhysician] = useState<string>(
    data.primaryPhysician
  );

  const handleUpdatePatient = async (patientId: string) => {
    try {
      setIsUpdating(true);
      const updatePatien = await updateMedicalePatient(
        patientId,
        bloodgroup,
        insuranceProvider,
        insurancePolicyNumber,
        allergies,
        primaryPhysician
      );
      if (patientId) {
        toast.success(
          `Le patient ${updatePatien.name} a été mis à jour avec succès`,
          {
            style: {
              color: "#22c55e",
              background: "#0D0F10",
              border: "1px solid #363A3D",
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
      setOpen(false);
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

        <AlertDialogContent className="bg-dark-200 border-dark-300 w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm text-white/70">
              Vous pouvez mettre à jour que les informations medicales de{" "}
              {data.name}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="w-full flex flex-col items-start gap-4">
            <div className="w-full flex items-center gap-4 justify-between">
              <div className="w-full flex flex-col items-start gap-2">
                <Label>Groupe sanguin</Label>
                <Input
                  type="text"
                  placeholder="Groupe sanguin"
                  value={bloodgroup}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setBloodgroup(e.target.value)
                  }
                  className="bg-transparent border-dark-500"
                />
              </div>
              <div className="w-full flex flex-col items-start gap-2">
                <Label>Assurance</Label>
                <Input
                  type="text"
                  placeholder="Assurance"
                  value={insuranceProvider}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setInsuranceProvider(e.target.value)
                  }
                  className="bg-transparent border-dark-500"
                />
              </div>
            </div>
            <div className="w-full flex items-center gap-4 justify-between">
              <div className="w-full flex flex-col items-start gap-2">
                <Label>Numero d'assurance</Label>
                <Input
                  type="text"
                  placeholder="Numero d'assurance"
                  value={insurancePolicyNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setInsurancePolicyNumber(e.target.value)
                  }
                  className="bg-transparent border-dark-500"
                />
              </div>
            </div>
            <div className="w-full flex flex-col items-start gap-2">
              <Label>Allergies</Label>
              <Textarea
                placeholder="exemple: cacahuètes, poussières"
                value={allergies}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setAllergies(e.target.value)
                }
                className="bg-transparent border-dark-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="w-full flex flex-col items-start gap-2">
              <Label>Medecin principal</Label>
              <Select
                name="primaryPhysician"
                value={primaryPhysician}
                onValueChange={(value) => setPrimaryPhysician(value)}
              >
                <SelectTrigger className="shad-select-trigger-dash">
                  <SelectValue className="" placeholder="Choisir le medecin" />
                </SelectTrigger>
                <SelectContent className="shad-select-content-dash">
                  <SelectGroup className="">
                    {Doctors.map((doctor, i) => (
                      <SelectItem key={doctor.name + i} value={doctor.name}>
                        <div className="flex cursor-pointer items-center gap-2">
                          <Image
                            src={doctor.image}
                            width={32}
                            height={32}
                            alt="doctor"
                            className="rounded-full border border-dark-500"
                          />
                          <p>{doctor.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialogFooter className="flex gap-4">
            <button
              className="text-sm text-red-500 font-extrabold transition-all hover:opacity-80"
              onClick={() => setOpen(false)}
            >
              Annuler
            </button>
            <button
              className="text-sm text-green-500 font-extrabold transition-all hover:opacity-80"
              onClick={() => handleUpdatePatient(data._id)}
            >
              {isUpdating ? "Updating..." : "Mettre à jour"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UpdatePatient;
