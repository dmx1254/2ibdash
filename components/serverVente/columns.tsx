"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ServerBuy, formatDateTime } from "@/lib/utils";

import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

import clsx from "clsx";
import DeleteServerVente from "../serverVenteAction/DeleteServerVente";
import UpdateServerVente from "../serverVenteAction/UpdateServerVente";
import ServerVenteDot from "../serverVenteAction/ServerVenteDot";

export const columns: ColumnDef<ServerBuy>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row?.index + 1}</p>,
  },
  {
    accessorKey: "serverName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Server
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="text-14-medium">{row?.original.serverName}</p>
    ),
  },
  {
    accessorKey: "serverCategory",
    header: "Categorie",
    cell: ({ row }) => (
      <p
        className={clsx(
          "inline-flex text-14-medium bg-dark-400 p-2 rounded-[6px]",
          {
            "text-[#24AE7C]": row?.original.serverCategory === "dofus-kamas",
            "text-[#3b82f6]": row?.original.serverCategory === "dofus-retro",
            "text-[#f97316]": row?.original.serverCategory === "dofus-touch",
            "text-[#14b8a6]": row?.original.serverCategory === "wakfu",
          }
        )}
      >
        {row?.original.serverCategory}
      </p>
    ),
  },

  {
    accessorKey: "serverPriceDh",
    header: "Prix(Maroc DH)",
    cell: ({ row }) => (
      <p className="text-14-medium">{row?.original.serverPrice}DH</p>
    ),
  },
  {
    accessorKey: "serverStatus",
    header: "Status",
    cell: ({ row }) => (
      <p
        className={clsx("text-14-medium p-2 rounded-[6px] inline-flex", {
          "bg-green-600 text-[#24AE7C]":
            row?.original.serverStatus === "Disponible",
          "bg-red-600 text-[#FF4F4E]":
            row?.original.serverStatus === "Stock complet",
          "bg-blue-600 text-[#3b82f6]":
            row?.original.serverStatus === "Vendre rapidement",
        })}
      >
        {row?.original.serverStatus}
      </p>
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
          <DeleteServerVente id={data._id} />
          <UpdateServerVente data={data} />
          <ServerVenteDot data={data} />
        </div>
      );
    },
  },
];
