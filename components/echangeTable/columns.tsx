"use client";

import { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ExchangeKamas } from "@/lib/types/types";
import EchangeDel from "../echangeAction/EchangeDel";
import EchangeDot from "../echangeAction/EchangeDot";
import SeeEchange from "../echangeAction/SeeEchange";

export const columns: ColumnDef<ExchangeKamas>[] = [
  {
    header: "N° d'echange",
    cell: ({ row }) => (
      <p className="text-14-medium">{row?.original.codeToExchange}</p>
    ),
  },
  {
    accessorKey: "serverOut",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Serveur à payer
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <p className="text-14-medium">
          <span className="text-[#24AE7C]">{row?.original.serverOut}</span>
        </p>
      </div>
    ),
  },
  {
    accessorKey: "pu",
    header: "Serveur à rec",
    cell: ({ row }) => (
      <p className="text-14-medium">{row?.original.serverIn}</p>
    ),
  },
  {
    accessorKey: "qtyToPay",
    header: "Qty à payer",
    cell: ({ row }) => (
      <p className="text-14-medium">{row?.original.qtyToPay}M</p>
    ),
  },
  {
    accessorKey: "qtyToReceive",
    header: "Qty à recevoir",
    cell: ({ row }) => (
      <p className="text-14-medium">{row?.original.qtyToReceive}M</p>
    ),
  },

  {
    accessorKey: "characterToPay",
    header: "Perso à payer",
    cell: ({ row }) => (
      <p className="text-14-medium">{row?.original.characterToPay}</p>
    ),
  },
  {
    accessorKey: "characterToReceive",
    header: "Perso à recevoir",
    cell: ({ row }) => (
      <p className="text-14-medium">{row?.original.characterToReceive}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row?.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row?.original.createdAt).dateOnly}
      </p>
    ),
  },

  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex items-center gap-2">
          <EchangeDel id={data._id} />
          <SeeEchange data={data} />
          <EchangeDot data={data} />
        </div>
      );
    },
  },
];
