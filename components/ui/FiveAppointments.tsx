import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppointmentResponse, Doc } from "@/types";
import { formatDateTime, getPrimaryPhysicianPicture } from "@/lib/utils";
import Image from "next/image";
import StatusBadge from "../StatusBadge";
import clsx from "clsx";

const FiveAppointments = ({ recentAppointments }: AppointmentResponse) => {
  const doctor: Doc = getPrimaryPhysicianPicture(
    recentAppointments.primaryPhysician
  );

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-3">
        <Image
          src={doctor ? doctor.image : ""}
          alt={doctor ? doctor.name : ""}
          width={100}
          height={100}
          className="size-8"
        />
        <p className="whitespace-nowrap"></p>
      </div>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">Dr. {doctor?.name}</p>
        <p
          className="text-12-semibold"
          style={{
            color: doctor.color,
          }}
        >
          {doctor.speciality}
        </p>
      </div>
      <div className="flex flex-col items-end ml-auto">
        <div className="flex text-xs font-semibold">
          <StatusBadge status={recentAppointments.status} />
          {/* <span
            className={clsx("status-12-semibold capitalize", {
              "text-green-500": recentAppointments.status === "scheduled",
              "text-yellow-500": recentAppointments.status === "pending",
              "text-red-500": recentAppointments.status === "cancelled",
            })}
          >
            {recentAppointments.status === "pending" && "En attente"}
            {recentAppointments.status === "scheduled" && "Programmé"}
            {recentAppointments.status === "cancelled" && "Annulé"}
          </span> &nbsp;
          pour le &nbsp;<span className="text-xs">{formatDateTime(recentAppointments.schedule).dateTime}</span> */}
        </div>
      </div>
    </div>
  );
};

export default FiveAppointments;
