"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Patient } from "@/types";
import DeleteDocteur from "../docteurAction/DeleteDocteur";
import UpdateDocteur from "../docteurAction/UpdateDocteur";
import DocteurAction from "../docteurAction/DocteurAction";
import UpdateDoctorStatus from "../docteurAction/UpdateDoctorStatus";
import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

export const columns: ColumnDef<Patient>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row?.index + 1}</p>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Docteur
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Image
            src={row?.original?.profile ? row?.original?.profile : ""}
            alt={row?.original?.name}
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {row.getValue("name")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => <p className="text-14-medium">{row?.original.phone}</p>,
  },

  {
    accessorKey: "speciality",
    header: "Spécialité",
    cell: ({ row }) => (
      <p className="text-14-medium whitespace-nowrap">
        {row?.original?.speciality}
      </p>
    ),
  },
  {
    accessorKey: "doctorStatus",
    header: "Status",
    cell: ({ row }) => (
      <div className="">
        {row?.original.doctorStatus ? (
          <span className="text-sm bg-dark-400 rounded-full text-center py-2 px-4 text-yellow-500">
            En service
          </span>
        ) : (
          <span className="text-sm bg-dark-400 rounded-full text-center py-2 px-4 text-red-500">
            Hors service
          </span>
        )}
      </div>
    ),
  },

  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1 max-xl:ml-4">
          <div className="flex items-center gap-3">
            <UpdateDoctorStatus
              id={data?._id}
              doctorStatus={data?.doctorStatus!}
            />
            <DeleteDocteur id={data._id} />
            <UpdateDocteur data={data} />
          </div>
          {/* <AppointmentModal
            type="schedule"
            patientId={data?.patientId}
            userId={data?.userId}
            phone={data?.phone}
            appointment={data}
          />
          <AppointmentModal
            type="cancel"
            patientId={data?.patientId}
            userId={data?.userId}
            appointment={data}
            phone={data?.phone}
          /> */}

          <DocteurAction data={data} />
        </div>
      );
    },
  },
];
