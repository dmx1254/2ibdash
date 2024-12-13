"use client";

import { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "../StatusBadge";
import { formatDateTime, parsedDevise } from "@/lib/utils";
import Image from "next/image";
import AppointmentModal from "../AppointmentModal";
import AppointmentAction from "../AppointmentAction";
import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Orderbuy } from "@/lib/types/types";
import OrderBuyDel from "../orderAction/OrderBuyDel";
import SeeOrderBuy from "../orderAction/SeeOrderBuy";
import OrderButDot from "../patientActtion/OrderButDot";

export const columns: ColumnDef<Orderbuy>[] = [
  {
    header: "OrderID",
    cell: ({ row }) => <p className="text-14-medium">{row?.original.numBuy}</p>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produit
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <p className="text-14-medium">
          <span>Categorie:</span>{" "}
          <span className="text-[#24AE7C]">{row?.original.jeu}</span>
        </p>
        <p className="text-14-medium">
          <span>Serveur:</span>{" "}
          <span className="text-[#3b82f6]">{row?.original.server}</span>
        </p>
        <p className="text-14-medium">
          <span>Personnage:</span>{" "}
          <span className="text-[#FF4F4E]">{row?.original.gameName}</span>
        </p>
      </div>
    ),
  },
  {
    accessorKey: "pu",
    header: "P.Unitaire",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {row?.original.pu}
        {parsedDevise(row?.original.currencymethod)}
      </p>
    ),
  },
  {
    accessorKey: "qte",
    header: "Quantité",
    cell: ({ row }) => <p className="text-14-medium">{row?.original.qte}M</p>,
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {row?.original.totalPrice}
        {parsedDevise(row?.original.currencymethod)}
      </p>
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
          <OrderBuyDel id={data._id} />
          <SeeOrderBuy data={data} />
          <OrderButDot data={data} />
        </div>
      );
    },
  },
];
