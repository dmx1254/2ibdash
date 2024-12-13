import React, { useState } from "react";
import {
  Pill,
  Plus,
  X,
  Save,
  Trash2,
  Clock,
  Calendar,
  Stethoscope,
  AlertCircle,
  FileText,
  ChevronRight,
  Loader,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import myStore from "@/lib/zustandmanage";
import { calculateAge } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PatientPrescription {
  name: string;
  age: number;
}

const Prescription = ({
  open,
  handlePrescriptionOpen,
  handlePrescriptionClose,
  setPrescriptionOpen,
}: {
  open: boolean;
  handlePrescriptionOpen: () => void;
  handlePrescriptionClose: () => void;
  setPrescriptionOpen: (val: boolean) => void;
}) => {
  const { patient } = myStore();
  const [medications, setMedications] = useState<Medication[]>([
    {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPrescriptionubmitting, setIsPrescriptionubmitting] =
    useState<boolean>(false);

  const commonFrequencies = [
    "1x par jour",
    "2x par jour",
    "3x par jour",
    "4x par jour",
    "Aux 4-6 heures",
    "Au besoin",
  ];

  const commonDurations = [
    "5 jours",
    "7 jours",
    "10 jours",
    "14 jours",
    "1 mois",
    "En continu",
  ];

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
    setActiveIndex(medications.length);
  };

  const removeMedication = (index: number) => {
    const newMeds = medications.filter((_, i) => i !== index);
    setMedications(newMeds);
    if (activeIndex >= index && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const newMeds = [...medications];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setMedications(newMeds);
  };

  const handleSave = async () => {
    const patientAge = calculateAge(patient?.birthDate);
    const newPatient = {
      name: patient?.name,
      age: patientAge,
    };
    const data = {
      patientId: patient?._id,
      patient: newPatient,
      medications,
    };
    try {
      setIsPrescriptionubmitting(true);

      const response = await axios.post("/api/prescription/create", data);
      if (response.data.successMessage) {
        toast.success(response.data.successMessage, {
          style: {
            color: "#22c55e",
            background: "#0D0F10",
            border: "1px solid #363A3D",
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPrescriptionubmitting(false);
    }
  };

  const isValid = medications.every(
    (med) => med.name && med.dosage && med.frequency && med.instructions
  );

  return (
    <Dialog open={open} onOpenChange={setPrescriptionOpen}>
      <DialogTrigger>
        <Button>
          <FileText className="text-light-200" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-dark-400 text-light-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-light-200">
            <FileText className="w-6 h-6 text-blue-500" />
            Nouvelle Prescription
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-dark-600">
            <Stethoscope className="w-4 h-4" />
            <span>Patient: {patient?.name}</span>
            <span className="mx-1">|</span>
            <span>ID: {patient?._id}</span>
            <span className="mx-1">|</span>
            <span>Âge: {calculateAge(patient?.birthDate)} ans</span>
          </div>
        </DialogHeader>
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Liste des médicaments */}
          <div className="w-64 border-r border-dark-500 overflow-y-auto p-2">
            {medications.map((med, index) => (
              <button
                key={index}
                className={`
                  w-full text-left p-3 rounded-lg mb-2
                  flex items-center gap-2
                  transition-all duration-200
                  ${
                    activeIndex === index
                      ? "bg-blue-600 border-2 border-blue-500"
                      : "border-2 border-transparent hover:bg-dark-500"
                  }
                  ${!med.name ? "italic text-dark-600" : "text-light-200"}
                `}
                onClick={() => setActiveIndex(index)}
              >
                <Pill className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">
                  {med.name || "Nouveau médicament"}
                </span>
                {medications.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMedication(index);
                    }}
                    className="opacity-0 hover:opacity-100 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </button>
            ))}
            <button
              onClick={addMedication}
              className="w-full p-3 rounded-lg border-2 border-dashed border-dark-500
                       hover:border-blue-500 hover:bg-blue-600 transition-all duration-200
                       flex items-center justify-center gap-2 text-dark-600 hover:text-light-200"
            >
              <Plus className="w-4 h-4" />
              Ajouter un médicament
            </button>
          </div>

          {/* Formulaire du médicament actif */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-light-200">
                  Nom du médicament
                </Label>
                <Input
                  id="name"
                  value={medications[activeIndex]?.name || ""}
                  onChange={(e) =>
                    updateMedication(activeIndex, "name", e.target.value)
                  }
                  placeholder="ex: Amoxicilline"
                  className="mt-1 bg-dark-300 border-dark-500 text-light-200 placeholder-dark-600"
                />
              </div>

              <div>
                <Label htmlFor="dosage" className="text-light-200">
                  Dosage
                </Label>
                <Input
                  id="dosage"
                  value={medications[activeIndex]?.dosage || ""}
                  onChange={(e) =>
                    updateMedication(activeIndex, "dosage", e.target.value)
                  }
                  placeholder="ex: 500mg"
                  className="mt-1 bg-dark-300 border-dark-500 text-light-200 placeholder-dark-600"
                />
              </div>

              <div>
                <Label className="text-light-200">Fréquence</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {commonFrequencies.map((freq, i) => (
                    <Button
                      key={i}
                      type="button"
                      variant={
                        medications[activeIndex]?.frequency === freq
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateMedication(activeIndex, "frequency", freq)
                      }
                      className={`justify-start 
                        ${
                          medications[activeIndex]?.frequency === freq
                            ? "bg-green-500 text-dark-300 hover:bg-green-500"
                            : "bg-dark-300 text-light-200 border-dark-500 hover:bg-dark-500"
                        }
                      `}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {freq}
                    </Button>
                  ))}
                </div>
                <Input
                  value={medications[activeIndex]?.frequency || ""}
                  onChange={(e) =>
                    updateMedication(activeIndex, "frequency", e.target.value)
                  }
                  placeholder="Autre fréquence..."
                  className="mt-2 bg-dark-300 border-dark-500 text-light-200 placeholder-dark-600"
                />
              </div>

              <div>
                <Label className="text-light-200">Durée du traitement</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {commonDurations.map((duration, i) => (
                    <Button
                      key={i}
                      type="button"
                      variant={
                        medications[activeIndex]?.duration === duration
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateMedication(activeIndex, "duration", duration)
                      }
                      className={`justify-start 
                        ${
                          medications[activeIndex]?.duration === duration
                            ? "bg-green-500 text-dark-300 hover:bg-green-500"
                            : "bg-dark-300 text-light-200 border-dark-500 hover:bg-dark-500"
                        }
                      `}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {duration}
                    </Button>
                  ))}
                </div>
                <Input
                  value={medications[activeIndex]?.duration || ""}
                  onChange={(e) =>
                    updateMedication(activeIndex, "duration", e.target.value)
                  }
                  placeholder="Autre durée..."
                  className="mt-2 bg-dark-300 border-dark-500 text-light-200 placeholder-dark-600"
                />
              </div>

              <div>
                <Label htmlFor="instructions" className="text-light-200">
                  Instructions spéciales
                </Label>
                <textarea
                  id="instructions"
                  value={medications[activeIndex]?.instructions || ""}
                  onChange={(e) =>
                    updateMedication(
                      activeIndex,
                      "instructions",
                      e.target.value
                    )
                  }
                  placeholder="ex: Prendre avec de la nourriture, éviter l'alcool..."
                  className="w-full mt-1 p-2 border rounded-md h-24 bg-dark-300 border-dark-500 text-light-200 placeholder-dark-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer avec boutons d'action */}
        <div className="border-t border-dark-500 pt-4 flex justify-between items-center">
          <Alert
            variant="destructive"
            className="flex-1 mr-4 bg-red-600 border-red-500"
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <AlertDescription className="text-light-200">
              Vérifiez attentivement les dosages et les interactions
              médicamenteuses
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrescriptionClose}
              className="bg-dark-300 text-light-200 border-dark-500 hover:bg-dark-500"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid || isPrescriptionubmitting}
              className={`gap-2 ${
                isValid
                  ? "bg-green-500 text-dark-300 hover:bg-green-600"
                  : "bg-dark-500 text-dark-600"
              }`}
            >
              {isPrescriptionubmitting ? (
                <span className="flex items-center gap-2 text-white">
                  <Loader size={20} className="animate-spin" /> Is submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Sauvegarder la prescription
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Prescription;
