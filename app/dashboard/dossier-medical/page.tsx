"use client";

import React, { ChangeEvent, act, useEffect, useState } from "react";
import { Search, Filter, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MedicaleFile from "@/components/MedicaleFile";
import { IdentificationTypes } from "@/constants";

import axios from "axios";
import { FilterType } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ActifRegisterDoctor, Patient } from "@/types";
import myStore from "@/lib/zustandmanage";
import Image from "next/image";
import clsx from "clsx";

const Medicale = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [searchType, setSearchType] = useState("name");
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [mockPatients, setMockPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState<number | null>(null);
  const [doctors, setDoctors] = useState<ActifRegisterDoctor[] | null>(null);

  const { addPatient, patient } = myStore();

  // Simuler des données de patients (à remplacer par votre API)

  const filterTypes = [
    { value: "name", label: "Nom" },
    { value: "phone", label: "Téléphone" },
    { value: "email", label: "Email" },
    { value: "identificationNumber", label: "N° Identification" },
    { value: "bloodgroup", label: "Groupe Sanguin" },
  ];

  const genderOptions = ["homme", "femme", "autre"];

  const addFilter = (type: string, value: string) => {
    setActiveFilters((prevFilters) => {
      // Vérifie si le type existe déjà
      const existingFilter = prevFilters.find((f) => f.type === type);

      if (existingFilter) {
        return prevFilters.map((f) => (f.type === type ? { ...f, value } : f));
      }

      return [...prevFilters, { type, value }];
    });
  };

  const removeFilter = (type: string, value: string) => {
    setActiveFilters(
      activeFilters.filter((f) => !(f.type === type && f.value === value))
    );
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const patientFiltre = async () => {
    if (activeFilters) {
    }
    const data = {
      [activeFilters[0]?.type]: activeFilters[0]?.value,
      [activeFilters[1]?.type]: activeFilters[1]?.value,
      [activeFilters[2]?.type]: activeFilters[2]?.value,
      [activeFilters[3]?.type]: activeFilters[3]?.value,
      [searchType]: searchQuery,
    };

    try {
      setIsSearchLoading(true);
      const response = await axios.post("/api/patient/getPatientsFiltre", data);
      const patient = response.data.patient;
      const totalDocuments = response.data.totalDocuments;
      setMockPatients(patient);
      setTotalPatients(totalDocuments);
      // console.log(response);
    } catch (error) {
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleAddPatient = (patient: Patient) => {
    addPatient(patient);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const getDoctors = async () => {
      const result = await axios.get("/api/doctor");
      setDoctors(result.data);
    };

    getDoctors();
  }, []);

  // console.log(activeFilters);

  return (
    <div className="min-h-screen bg-dark-300 p-6">
      {!isOpen && patient ? (
        <MedicaleFile handleOpen={handleOpen} />
      ) : (
        <div className="max-w-4xl mx-auto">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-14 text-lg bg-dark-400 hover:bg-dark-500 text-light-200 border-2 border-dark-500">
                <Search className="w-6 h-6 mr-2" />
                Rechercher un patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-sm:h-[600px] max-sm:overflow-y-scroll bg-dark-400 text-light-200 border-dark-500 hide-scrollbar-pat">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-light-200">
                  Rechercher un patient
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Barre de recherche principale */}
                <div className="flex max-sm:flex-col gap-4">
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-dark-500 border-none">
                      <SelectValue placeholder="Type de recherche" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-400 border-dark-500">
                      {filterTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="text-light-200 hover:bg-dark-500"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-dark-500 border-none text-light-200 pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-600" />
                  </div>

                  <Button
                    onClick={patientFiltre}
                    className={clsx(
                      "bg-blue-600 hover:opacity-85 text-green-500",
                      {
                        "opacity-75": !searchQuery,
                      }
                    )}
                    disabled={!searchQuery}
                  >
                    Rechercher
                  </Button>
                </div>

                {/* Filtres actifs */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter, index) => (
                      <Badge
                        key={index}
                        className="bg-blue-600 text-light-200 px-3 py-1"
                      >
                        {filter.type}: {filter.value}
                        <X
                          className="w-3 h-3 ml-2 cursor-pointer"
                          onClick={() =>
                            removeFilter(filter.type, filter.value)
                          }
                        />
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Filtres avancés */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-dark-600" />
                    <span className="text-dark-600">Filtres avancés</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-dark-600 mb-1 block">
                        Groupe sanguin
                      </label>
                      <Select
                        onValueChange={(value) =>
                          addFilter("bloodgroup", value)
                        }
                      >
                        <SelectTrigger className="bg-dark-500 border-none">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-400 border-dark-500">
                          {bloodGroups.map((group) => (
                            <SelectItem
                              key={group}
                              value={group}
                              className="text-light-200 hover:bg-dark-500"
                            >
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-dark-600 mb-1 block">
                        Type d'identification
                      </label>
                      <Select
                        onValueChange={(value) =>
                          addFilter("identificationType", value)
                        }
                      >
                        <SelectTrigger className="bg-dark-500 border-none">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-400 border-dark-500">
                          {IdentificationTypes.map((id, index) => (
                            <SelectItem
                              key={`${id}_${index}`}
                              value={id}
                              className="text-light-200 hover:bg-dark-500"
                            >
                              {id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-dark-600 mb-1 block">
                        Genre
                      </label>
                      <Select
                        onValueChange={(value) => addFilter("gender", value)}
                      >
                        <SelectTrigger className="bg-dark-500 border-none">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-400 border-dark-500">
                          {genderOptions.map((gender) => (
                            <SelectItem
                              key={gender}
                              value={gender}
                              className="text-light-200 hover:bg-dark-500"
                            >
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-dark-600 mb-1 block">
                        Médecin traitant
                      </label>
                      <Select
                        onValueChange={(value) =>
                          addFilter("primaryPhysician", value)
                        }
                        defaultValue=""
                      >
                        <SelectTrigger className="bg-dark-500 border-none">
                          <SelectValue placeholder="Sélectionner le medecin" />
                        </SelectTrigger>

                        <SelectContent className="shad-select-content">
                          {doctors?.map((doctor, i) => (
                            <SelectItem
                              key={doctor.name + i}
                              value={doctor.name}
                            >
                              <div className="flex cursor-pointer items-center gap-2">
                                <Image
                                  src={doctor.profile}
                                  width={32}
                                  height={32}
                                  alt="doctor"
                                  className="rounded-full border border-dark-500"
                                />
                                <p>{doctor.name}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Résultats de recherche */}
                <div
                  className={clsx(
                    "mt-6 space-y-2 overflow-y-scroll hide-scrollbar-pat",
                    {
                      "h-28": mockPatients.length > 0 || isSearchLoading,
                      "h-0": !mockPatients.length && !isSearchLoading,
                    }
                  )}
                >
                  {isSearchLoading ? (
                    <>
                      <div className="w-full rounded-[10px] p-4 flex items-start justify-between gap-2 bg-dark-500">
                        <div className="w-full flex flex-col items-start gap-2">
                          <Skeleton className="w-full max-w-36 h-4"></Skeleton>
                          <Skeleton className="w-full max-w-24 h-4"></Skeleton>
                          <Skeleton className="w-full max-w-16 h-4"></Skeleton>
                        </div>
                        <Skeleton className="w-4 h-4"></Skeleton>
                      </div>
                      <div className="w-full rounded-[10px] p-4 flex items-start justify-between gap-2 bg-dark-500">
                        <div className="w-full flex flex-col items-start gap-2">
                          <Skeleton className="w-full max-w-36 h-4"></Skeleton>
                          <Skeleton className="w-full max-w-24 h-4"></Skeleton>
                          <Skeleton className="w-full max-w-16 h-4"></Skeleton>
                        </div>
                        <Skeleton className="w-4 h-4"></Skeleton>
                      </div>
                    </>
                  ) : (
                    mockPatients.map((patient) => (
                      <div
                        key={patient._id}
                        onClick={() => handleAddPatient(patient)}
                        className="p-4 bg-dark-500 rounded-lg hover:bg-dark-300 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-light-200">
                              {patient.name}
                            </h3>
                            <p className="text-sm text-dark-600">
                              {patient.email}
                            </p>
                            <p className="text-sm text-dark-600">
                              {patient.phone}
                            </p>
                          </div>
                          <Badge className="bg-blue-600 text-green-500">
                            {patient.bloodgroup}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}

                  {/* {!mockPatients.length && (
                    <div className="">
                      <p>Aucun resultat trouve avec ces filtres</p>
                    </div>
                  )} */}
                </div>
              </div>
              <button
                className="p-2 outline-none bg-blue-600 text-green-500 transition-colors hover:opacity-90"
                onClick={patientFiltre}
              >
                {isSearchLoading ? "Searching..." : "Appliquer"}
              </button>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default Medicale;
