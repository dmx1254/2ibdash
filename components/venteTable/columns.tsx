"use client";

import { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "../StatusBadge";
import { formatDateTime, parsedDevise } from "@/lib/utils";
import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { OrderSell } from "@/lib/types/types";
import OrderVenteDel from "../venteAction/OrderVenteDel";
import SeeOrderVente from "../venteAction/SeeOrderVente";
import OrderVenteDot from "../venteAction/OrderVenteDot";

export const columns: ColumnDef<OrderSell>[] = [
  {
    header: "OrderID",
    cell: ({ row }) => (
      <p className="text-14-medium">#{row?.original.orderNum}</p>
    ),
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
      <div className="flex flex-col items-start gap-2">
        {row.original.products.map((p, index) => (
          <p className="text-14-medium" key={index}>
            <span className="">{`${p.server} - ${p.totalPrice}${parsedDevise(
              row.original.cur
            )}`}</span>
          </p>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {row?.original.totalPrice}
        {parsedDevise(row?.original.cur)}
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
          <OrderVenteDel id={data._id} />
          <SeeOrderVente data={data} />
          <OrderVenteDot data={data} />
        </div>
      );
    },
  },
];
