import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  Calendar,
  MapPin,
  Briefcase,
  User,
  Heart,
  Activity,
  Shield,
  Clock,
  Wifi,
  MonitorSmartphone,
  X,
  Pill,
  ClipboardPlus,
  GlobeLock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import myStore from "@/lib/zustandmanage";
import Image from "next/image";
import FloatingActionButtons from "./SearchButton";
import axios from "axios";
import { ActifRegisterDoctor } from "@/types";

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

interface Prescription {
  patientId: string;
  patient: PatientPrescription;
  medications: Medication[];
  read: boolean;
}

const MedicaleFile = ({ handleOpen }: { handleOpen: () => void }) => {
  const { patient: patientData } = myStore();
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [doctor, setDoctor] = useState<ActifRegisterDoctor | null>(null);

  // console.log(patientPrescription);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  //   console.log(patientData);
  const formatBirthDate = (date: Date | undefined) => {
    if (date)
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  };

  const formatDate = (dateString: string | undefined) => {
    if (dateString) return formatDateTime(dateString).dateTime;
  };

  useEffect(() => {
    const getPatientDoctor = async () => {
      const data = {
        primaryPhysician: patientData?.primaryPhysician,
      };
      try {
        const response = await axios.post("/api/doctor/getPatientDoctor", data);
        if (response.data) {
          setDoctor(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (patientData?.primaryPhysician) {
      getPatientDoctor();
    }
  }, [patientData?.primaryPhysician]);

  return (
    <div className="min-h-screen bg-dark-300 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête avec informations principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-dark-400 border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-light-200">
                  {patientData?.name}
                </CardTitle>
                <p className="text-dark-600">ID: {patientData?._id}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className="text-light-200">{patientData?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-500" />
                    <span className="text-light-200">{patientData?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span className="text-light-200">
                      {patientData?.address}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-light-200">
                      Né(e) le {formatBirthDate(patientData?.birthDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-green-500" />
                    <span className="text-light-200">
                      {patientData?.gender}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-red-500" />
                    <span className="text-light-200">
                      {patientData?.occupation}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-light-200 rounded-lg transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un email
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-light-200 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Envoyer un SMS
                </button>
              </div>

              <CardTitle className="text-xl font-bold text-light-200 mt-8">
                Informations de connexion
              </CardTitle>

              <div className="flex flex-col items-start gap-3 mt-4">
                {patientData?.online ? (
                  <span className="flex items-center gap-1">
                    {/* <Wifi className="w-4 h-4 text-green-500 mr-2" /> */}
                    <span className="flex h-2 w-2">
                      <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-green-500">En ligne</span>
                  </span>
                ) : (
                  patientData?.lastConnexion && (
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 text-dark-600 mr-2" />
                      <span className="text-dark-600">
                        Dernière connexion:{" "}
                        {formatDate(patientData?.lastConnexion)}
                      </span>
                    </span>
                  )
                )}

                <span className="flex items-center mr-1">
                  <MonitorSmartphone className="w-4 h-4 text-dark-600 mr-2" />
                  <span className="text-dark-600">
                    Appareil utilisé:{" "}
                    {patientData?.deviceUsed
                      ? patientData?.deviceUsed
                      : "Inconnu"}
                  </span>
                </span>
                <span className="flex items-center mr-1">
                  <GlobeLock className="w-4 h-4 text-dark-600 mr-2" />
                  <span className="text-dark-600">
                    Addrese IP :{" "}
                    {patientData?.lastIpUsed
                      ? patientData?.lastIpUsed
                      : "Inconnu"}
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-400 border-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-light-200">
                Informations Médicales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-dark-600">Groupe sanguin</p>
                  <p className="text-light-200 font-semibold">
                    {patientData?.bloodgroup}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-700" />
                <div>
                  <p className="text-dark-600">Allergies</p>
                  <p className="text-light-200">
                    {patientData?.allergies || "Aucune allergie"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-dark-600">Médecin traitant</p>
                  <div className="flex items-center gap-2">
                    <Image
                      src={doctor?.profile ? doctor?.profile : "/doctor.png"}
                      height={80}
                      width={80}
                      alt="doctor"
                      className="size-8"
                    />
                    <p className="text-light-200">
                      Dr. {patientData?.primaryPhysician}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ClipboardPlus className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-dark-600">Hostorique médicale</p>
                  <p className="text-light-200">
                    {patientData?.pastMedicalHistory || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Pill className="w-5 h-5 text-violet-500" />
                <div>
                  <p className="text-dark-600">Médicament actuel</p>
                  <p className="text-light-200">
                    {patientData?.currentMedication || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ClipboardPlus className="w-5 h-5 text-fuchsia-500" />
                <div>
                  <p className="text-dark-600">Hostorique médicale familiale</p>
                  <p className="text-light-200">
                    {patientData?.familyMedicalHistory || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations d'assurance */}
        <Card className="bg-dark-400 border-none">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-light-200">
              Informations d'Assurance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-dark-600">Assureur</p>
                <p className="text-light-200">
                  {patientData?.insuranceProvider || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-dark-600">Numéro d'assurance</p>
                <p className="text-light-200">
                  {patientData?.insurancePolicyNumber || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-dark-400 border-none">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-light-200">
              Informations d'identification
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-dark-600">Type d'identification</p>
                <p className="text-light-200">
                  {patientData?.identificationType}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-dark-600">Numéro d'identification</p>
                <p className="text-light-200">
                  {patientData?.identificationNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-3">
                {patientData?.identificationDocument && (
                  <div
                    onClick={toggleZoom}
                    className="cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <Image
                      src={patientData.identificationDocument}
                      alt="Document d'identification"
                      width={50}
                      height={50}
                      className="rounded-md object-cover w-10 h-10"
                    />
                  </div>
                )}
                <div>
                  <p className="text-dark-600 font-medium">
                    Document d'identification
                  </p>
                  <p className="text-light-200 text-sm">
                    Cliquez pour agrandir
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Modal pour l'aperçu agrandi */}
          {isZoomed && patientData?.identificationDocument && (
            <div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={toggleZoom}
            >
              <div
                className="relative bg-dark-400 p-2 rounded-lg max-w-2xl w-full mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={patientData.identificationDocument}
                  alt="Document d'identification"
                  width={400}
                  height={300}
                  className="rounded-lg w-full h-auto object-contain"
                />
                <button
                  onClick={toggleZoom}
                  className="absolute -top-1 -right-2 shadow-inner bg-green-500 text-green-600 rounded-full p-1 hover:bg-dark-800"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Contact d'urgence */}
        <Card className="bg-dark-400 border-none">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-light-200">
              Contact d'Urgence
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-dark-600">Nom du contact</p>
                <p className="text-light-200">
                  {patientData?.emergencyContactName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-dark-600">Numéro du contact</p>
                <p className="text-light-200">
                  {patientData?.emergencyContactNumber}
                </p>
                <button className="mt-2 flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-light-200 rounded-lg transition-colors text-sm">
                  <Phone className="w-3 h-3 mr-2" />
                  Appeler en urgence
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {patientData && <FloatingActionButtons onOpen={handleOpen} />}
    </div>
  );
};

export default MedicaleFile;
