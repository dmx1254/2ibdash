"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  BriefcaseMedical,
  History,
} from "lucide-react";
import myStore from "@/lib/zustandmanage";
import axios from "axios";

import { formatDateTime } from "@/lib/utils";

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
  createdAt: Date;
  updatedAt: Date;
}

interface MedicalTest {
  id: string;
  name: string;
  date: string;
  result: string;
  type: string;
  fileUrl?: string;
}

const MedicalHistory = () => {
  const { patient } = myStore();
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [patientPrescriptions, setPatientPrescriptions] = useState<
    Prescription[] | null
  >(null);
  const [patientTests, setPatientTests] = useState<MedicalTest[] | null>(null);
  const [patientName, setPatientName] = useState<string>("");

  const onAddPrescription = () => {
    console.log("Yes");
  };
  const onEditPrescription = (prescription: Prescription) => {
    console.log("Yes");
  };
  const onDeletePrescription = (prescriptionId: string) => {
    console.log("Yes");
  };
  const onAddTest = () => {
    console.log("Yes");
  };
  const onDeleteTest = (testId: string) => {
    console.log("Yes");
  };
  const onViewTestFile = (fileUrl: string) => {
    console.log("Yes");
  };

  useEffect(() => {
    const getPatientPrescriptions = async () => {
      const data = {
        patientId: patient?._id,
      };
      try {
        const response = await axios.post(
          "/api/prescription/patientPrescription",
          data
        );
        if (response.data) {
          setPatientPrescriptions(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (patient?._id) {
      getPatientPrescriptions();
    }
  }, [patient?._id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <History className="text-light-200" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-dark-300 text-white border-dark-500">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            Historique médical - {patient?.name}
          </DialogTitle>
          <DialogDescription className="text-dark-600">
            Afficher et gérer les prescriptions médicales et les dossiers de
            tests
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-dark-400 mb-4">
            <TabsTrigger
              value="prescriptions"
              className={`${
                activeTab === "prescriptions" ? "bg-green-600" : ""
              }`}
            >
              Ordonnances
            </TabsTrigger>
            <TabsTrigger
              value="tests"
              className={`${activeTab === "tests" ? "bg-blue-600" : ""}`}
            >
              Tests médicaux
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ordonnances</h2>
              {/* <Button
                onClick={onAddPrescription}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="mr-2" /> Ajouter
              </Button> */}
            </div>

            <Table>
              <TableHeader className="bg-[#171E21]">
                <TableRow className="border-green-600">
                  <TableHead className="text-white">Nom</TableHead>
                  <TableHead className="text-white">Age</TableHead>
                  <TableHead className="text-white">Medicaments</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientPrescriptions?.map((prescription, index) => (
                  <TableRow
                    key={index}
                    // className={`${
                    //   \!prescription.read ? "bg-blue-600" : "bg-dark-400"
                    // }`}
                    className="bg-dark-400 border-green-600"
                  >
                    <TableCell>{prescription.patient.name}</TableCell>
                    <TableCell>{prescription.patient.age}</TableCell>
                    <TableCell>
                      {prescription.medications.map((med, medIndex) => (
                        <div key={medIndex} className="mb-1">
                          {med.name} - {med.dosage}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(prescription.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-green-500 hover:bg-green-600 border-dark-500"
                          onClick={() => onEditPrescription(prescription)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:bg-red-600 border-dark-500"
                          onClick={() =>
                            onDeletePrescription(prescription.patientId)
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="tests">
            <div className="flex justify-between items-center my-5">
              <h2 className="text-xl font-bold">Tests médicaux</h2>
              {/* <Button
                onClick={onAddTest}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="mr-2" /> Add Test
              </Button> */}
            </div>

            <Table>
              <TableHeader className="bg-dark-400">
                <TableRow>
                  <TableHead className="text-white">Nom</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Resultat</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientTests?.map((test) => (
                  <TableRow key={test.id} className="bg-dark-400">
                    <TableCell>{test.name}</TableCell>
                    <TableCell>{test.date}</TableCell>
                    <TableCell>{test.type}</TableCell>
                    <TableCell>{test.result}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {test.fileUrl && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-blue-500 hover:bg-blue-600"
                            onClick={() => onViewTestFile(test.fileUrl || "")}
                          >
                            <FileText size={16} />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:bg-red-600"
                          onClick={() => onDeleteTest(test.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalHistory;
