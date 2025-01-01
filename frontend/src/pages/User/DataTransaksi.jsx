import UserLayout from "@/components/component/UserLayout.jsx";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import dummyTransactions from "@/lib/data.js";
import Table from "@/components/component/Table.jsx";
import { FileText, Search, BarChart2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DataTransaksi() {
  const columns = React.useMemo(
    () => [
      {
        header: "No Nota",
        accessorKey: "nota",
        cell: ({ row }) => (
          <span className="font-medium text-blue-600">{row.original.nota}</span>
        ),
      },
      {
        header: "Nama Pelanggan",
        accessorKey: "customer_name",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.customer_name}</div>
        ),
      },
      {
        header: "Kasir",
        accessorKey: "cashier_name",
      },
      {
        header: "Tanggal",
        accessorKey: "date",
        cell: ({ row }) => (
          <span className="text-gray-600">{row.original.date}</span>
        ),
      },
      {
        header: "Metode Pembayaran",
        accessorKey: "payment_method",
        cell: ({ row }) => {
          const method =
            row.original.payment_method.charAt(0).toUpperCase() +
            row.original.payment_method.slice(1);
          return (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              {method}
            </span>
          );
        },
      },
      {
        header: "Subtotal",
        accessorKey: "subtotal",
        cell: ({ row }) => (
          <span className="font-medium">
            Rp {row.original.subtotal.toLocaleString()}
          </span>
        ),
      },
      {
        header: "Total",
        accessorKey: "total",
        cell: ({ row }) => (
          <span className="font-semibold text-blue-700">
            Rp {row.original.total.toLocaleString()}
          </span>
        ),
      },
      {
        header: "Detail",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
            onClick={() => handleViewDetail(row.original)}
          >
            <FileText size={14} />
            Detail
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <UserLayout>
        <div className="w-full bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-8 h-8 text-blue-500" />
              <p className="text-2xl font-semibold text-gray-800">
                Data Transaksi
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white mt-5 p-8 min-h-screen rounded-xl shadow-lg">
          <Table data={dummyTransactions} columns={columns} />
        </div>
      </UserLayout>
    </div>
  );
}
