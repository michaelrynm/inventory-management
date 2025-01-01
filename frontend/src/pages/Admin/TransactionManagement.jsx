import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
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
import { Search, FilterX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import AdminLayout from "@/components/component/AdminLayout.jsx";

// Dummy data transaksi
const initialTransactions = [
  {
    id: "TRX001",
    date: "2024-01-01 10:30:00",
    kasir: "John Doe",
    total: 150000,
    payment: "Cash",
    status: "completed",
    customer: "Pelanggan Umum",
    items: [{ product: "Beras Premium", qty: 2, price: 75000, total: 150000 }],
  },
  {
    id: "TRX002",
    date: "2024-01-01 11:45:00",
    kasir: "Jane Smith",
    total: 85000,
    payment: "QRIS",
    status: "completed",
    customer: "Ahmad",
    items: [
      { product: "Minyak Goreng", qty: 1, price: 45000, total: 45000 },
      { product: "Gula Pasir", qty: 2, price: 20000, total: 40000 },
    ],
  },
];

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterKasir, setFilterKasir] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [date, setDate] = useState({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(2024, 0, 1), 7),
  });

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

  // Handle search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchSearch = transaction.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchKasir =
      filterKasir === "all" ? true : transaction.kasir === filterKasir;
    const matchStatus =
      filterStatus === "all" ? true : transaction.status === filterStatus;
    return matchSearch && matchKasir && matchStatus;
  });

  // Handle view detail
  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterKasir("all");
    setFilterStatus("all");
    setDate({
      from: new Date(2024, 0, 1),
      to: addDays(new Date(2024, 0, 1), 7),
    });
  };

  return (
    <div>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Transaksi</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari no. transaksi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                </div>

                <Select value={filterKasir} onValueChange={setFilterKasir}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Kasir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kasir</SelectItem>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status Transaksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleResetFilters}>
                  <FilterX className="w-4 h-4 mr-2" />
                  Reset Filter
                </Button>
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
                    <TableHead>No. Transaksi</TableHead>
                    <TableHead>Tanggal & Waktu</TableHead>
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
                      <TableCell className="font-medium">
                        {transaction.id}
                      </TableCell>
                      <TableCell>{formatDateTime(transaction.date)}</TableCell>
                      <TableCell>{transaction.kasir}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>{formatCurrency(transaction.total)}</TableCell>
                      <TableCell>{transaction.payment}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "success"
                              : transaction.status === "pending"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(transaction)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Detail Transaction Dialog */}
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  Detail Transaksi {selectedTransaction?.id}
                </DialogTitle>
              </DialogHeader>
              {selectedTransaction && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                      <p className="font-medium">
                        {formatDateTime(selectedTransaction.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kasir</p>
                      <p className="font-medium">{selectedTransaction.kasir}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pelanggan</p>
                      <p className="font-medium">
                        {selectedTransaction.customer}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Metode Pembayaran</p>
                      <p className="font-medium">
                        {selectedTransaction.payment}
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
                        {selectedTransaction.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product}</TableCell>
                            <TableCell className="text-right">
                              {item.qty}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.total)}
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
                            {formatCurrency(selectedTransaction.total)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </div>
  );
}
