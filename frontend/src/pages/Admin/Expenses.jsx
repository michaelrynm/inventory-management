import React, { useState, useEffect } from "react";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash, Download } from "lucide-react";
import AdminLayout from "@/components/component/AdminLayout.jsx";
import axios from "axios";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

const API_URL = "http://localhost:3000/api/expenses";

export default function Expenses() {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(API_URL);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      Swal.fire("Error", "Gagal mengambil data pengeluaran", "error");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save expense
  const handleSaveExpense = async () => {
    const userId = sessionStorage.getItem("userId");
    try {
      await axios.post(API_URL, {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date,
        userId: parseInt(userId),
      });

      Swal.fire("Berhasil", "Pengeluaran berhasil ditambahkan", "success");
      fetchExpenses();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving expense:", error);
      Swal.fire("Error", "Gagal menyimpan pengeluaran", "error");
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Pengeluaran yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          fetchExpenses();
          Swal.fire("Berhasil", "Pengeluaran berhasil dihapus", "success");
        } catch (error) {
          console.error("Error deleting expense:", error);
          Swal.fire("Error", "Gagal menghapus pengeluaran", "error");
        }
      }
    });
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setNewExpense({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Pengeluaran</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pengeluaran
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
                <DialogDescription>
                  Masukkan informasi pengeluaran di bawah ini.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Deskripsi
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={newExpense.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Jumlah
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={newExpense.amount}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Tanggal
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newExpense.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Batal
                </Button>
                <Button onClick={handleSaveExpense}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Pengeluaran</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari pengeluaran..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[300px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="pt-4">
                    <CSVLink
                      data={filteredExpenses}
                      filename="Data Pengeluaran"
                      target="_blank"
                    >
                      <Button
                        variant="outline"
                        className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                      >
                        <Download size={16} className="mr-2" />
                        Export to CSV
                      </Button>
                    </CSVLink>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
