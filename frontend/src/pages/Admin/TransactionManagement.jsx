import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "@/components/component/AdminLayout.jsx";
import axios from "axios";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import { Download } from "lucide-react";

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKasir, setFilterKasir] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [saleDetails, setSaleDetails] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "https://inventory-management-orpin-six.vercel.app/api/sales/admin"
      );
      setTransactions(response.data);
    } catch (error) {
      console.log("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Apply filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by search term
    const matchSearch =
      transaction.id.toString().includes(searchTerm) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by Kasir
    const matchKasir =
      filterKasir === "all" || transaction.user.name === filterKasir;

    return matchSearch && matchKasir;
  });

  // Fetch sale details
  const fetchSaleDetails = async (saleId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://inventory-management-orpin-six.vercel.app/api/sale-details/${saleId}`
      );
      setSaleDetails(response.data);
    } catch (error) {
      console.error("Error fetching sale details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view detail
  const handleViewDetail = async (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
    await fetchSaleDetails(transaction.id);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterKasir("all");
  };

  // Close detail dialog
  const handleDialogClose = () => {
    setIsDetailOpen(false);
    setSaleDetails(null);
    setSelectedTransaction(null);
  };

  const handleDeleteSales = async (id) => {
    try {
      const response = await axios.delete(
        `https://inventory-management-orpin-six.vercel.app/api/sales/${id}`
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Data Transaksi Berhasil Dihapus",
        });
        fetchTransactions();
      }
    } catch (error) {
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Data Transaksi Gagal Dihapus",
        });
      }
      console.log(error);
    }
  };

  // Get unique kasir names for dropdown options
  const uniqueKasirs = [...new Set(transactions.map((t) => t.user.name))];

  const csvData = filteredTransactions.map((item) => ({
    id: item.id,
    userId: item.userId,
    customer: item.customer,
    totalAmount: item.totalAmount,
    paymentMethod: item.paymentMethod,
    createdAt: item.createdAt,
    userName: item.user.name, // Ambil langsung value name dari object user
  }));

  return (
    <div>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Transaksi</h1>
            <Button onClick={handleResetFilters} variant="outline">
              Reset Filter
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search Filter */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari ID atau nama pelanggan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Filter Kasir */}
                <div>
                  <select
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
                    value={filterKasir}
                    onChange={(e) => setFilterKasir(e.target.value)}
                  >
                    <option value="all">Semua Kasir</option>
                    {uniqueKasirs.map((kasir, index) => (
                      <option key={index} value={kasir}>
                        {kasir}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Transaksi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Kasir</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pembayaran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{formatDateTime(transaction.date)}</TableCell>
                      <TableCell>{transaction.user.name}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>
                        {formatCurrency(transaction.totalAmount)}
                      </TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant="success" className="bg-green-400">
                          Completed
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(transaction)}
                        >
                          Detail
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSales(transaction.id)}
                          className="bg-red-500 text-white"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Tidak ada data yang sesuai dengan filter
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <CSVLink
                    data={csvData}
                    filename="Data Transaksi"
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white mt-5"
                    >
                      <Download size={16} className="mr-2" />
                      Export to CSV
                    </Button>
                  </CSVLink>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          {/* Detail Transaction Dialog */}
          <Dialog open={isDetailOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  Detail Transaksi {selectedTransaction?.id}
                </DialogTitle>
              </DialogHeader>
              {isLoading ? (
                <div className="flex justify-center items-center p-4">
                  Loading...
                </div>
              ) : (
                saleDetails && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                        <p className="font-medium">
                          {formatDateTime(selectedTransaction.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Kasir</p>
                        <p className="font-medium">
                          {selectedTransaction.user.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pelanggan</p>
                        <p className="font-medium">
                          {selectedTransaction.customer}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Metode Pembayaran
                        </p>
                        <p className="font-medium">
                          {selectedTransaction.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="font-medium mb-2">Detail Item</p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produk</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Harga</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {saleDetails.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.price)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.totalPrice)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-right font-medium"
                            >
                              Total
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(selectedTransaction.totalAmount)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </div>
  );
}
