"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppointModal } from "@/types/appwrite.types";
import clsx from "clsx";
import { dateFrToConvert, formatDateTime } from "@/lib/utils";

const SeeAppointment = ({ data }: { data: AppointModal }) => {
  const [open, setOpen] = useState<boolean>(false);
  //   console.log(data);
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <button
          className="border-none outline-none cursor-pointer transition-all hover:opacity-80 text-sm mx-2"
          onClick={() => setOpen(true)}
        >
          Voir le rendez-vous
        </button>

        <AlertDialogContent className="bg-dark-200 border-dark-300 w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-white">
              Détails du rendez-vous
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 text-14-regular">
            Le rendez vous avec{" "}
            <span className="underline font-semibold">{data.name}</span> prevu
            le{" "}
            <span className="font-semibold underline">
              {formatDateTime(data.schedule).dateTime}{" "}
            </span>
            {data.status === "scheduled" ? "a été" : "est en"}
            &nbsp;
            <span
              className={clsx("underline", {
                "text-[#15803d]": data.status === "scheduled",
                "text-[#a16207]": data.status === "pending",
                "text-[#b91c1c]": data.status === "cancelled",
              })}
            >
              {data.status === "pending" && "En attente"}
              {data.status === "scheduled" && "Programmé"}
              {data.status === "cancelled" && "Annulé"}.
            </span>
            <div className="flex flex-col items-start gap-2">
              <div>
                <span className="text-blue-700 underline">
                  Motif du rendez vous:&nbsp;
                </span>
                {data.reason}
              </div>

              {data.note ? (
                <div>
                  {" "}
                  <span className="text-orange-700 underline">
                    note du patient:
                  </span>
                  &nbsp;<span>{data.note}</span>
                </div>
              ) : null}
              {data.cancellationReason ? (
                <div>
                  {" "}
                  <span className="text-red-700 underline">
                    Motif de l'annulation:
                  </span>
                  &nbsp;<span>{data.cancellationReason}</span>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="text-14-regular">
                Date de création :{" "}
                <span className="text-white">
                  {dateFrToConvert(data?.createdAt)}
                </span>
              </p>
              <p className="text-14-regular">
                Date de mise à jour le :{" "}
                <span className="text-white">
                  {dateFrToConvert(data?.updatedAt)}
                </span>
              </p>
            </div>
          </div>
          <AlertDialogFooter className="flex w-full items-start justify-between gap-4">
            <button
              className="text-sm text-red-500 font-extrabold transition-all hover:opacity-80"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SeeAppointment;
