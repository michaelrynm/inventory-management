import UserLayout from "@/components/component/UserLayout.jsx";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Table from "@/components/component/Table.jsx";
import { FileText, BarChart2 } from "lucide-react";
import axios from "axios";
import TransactionDetailModal from "./DetailTransactionModal.jsx";
import { CSVDownload } from "react-csv";

export default function DataTransaksi() {
  const id = sessionStorage.getItem("userId");
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => (
          <span className="font-medium text-blue-600">{row.original.id}</span>
        ),
      },
      {
        header: "Nama Pelanggan",
        accessorKey: "customer",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.customer}</div>
        ),
      },
      {
        header: "Tanggal",
        accessorKey: "date",
        cell: ({ row }) => (
          <span className="text-gray-600">
            {new Date(row.original.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        header: "Metode Pembayaran",
        accessorKey: "paymentMethod",
        cell: ({ row }) => {
          const method =
            row.original.paymentMethod.charAt(0).toUpperCase() +
            row.original.paymentMethod.slice(1).toLowerCase();
          return (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              {method}
            </span>
          );
        },
      },
      {
        header: "Total",
        accessorKey: "totalAmount",
        cell: ({ row }) => (
          <span className="font-semibold text-blue-700">
            Rp {row.original.totalAmount?.toLocaleString() ?? "0"}
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

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(
          `https://inventory-management-orpin-six.vercel.app/api/sales/user/${id}`
        );
        setDataTransaksi(response.data);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };
    fetchTransactionData();
  }, []);

  const handleViewDetail = (transaction) => {
    console.log("Viewing detail for transaction:", transaction);
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

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
          <Table data={dataTransaksi} columns={columns} />
        </div>
        <TransactionDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={selectedTransaction}
        />
      </UserLayout>
    </div>
  );
}
