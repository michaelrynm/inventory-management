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
import { Search, Plus, Trash, Download, Pencil } from "lucide-react";
import AdminLayout from "@/components/component/AdminLayout.jsx";
import axios from "axios";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

const API_URL = "https://inventory-management-orpin-six.vercel.app/api/expenses";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: "",
    description: "",
    supplier: "",
    amount: "",
    unit: "",
    price: "",
    totalPrice: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [editExpense, setEditExpense] = useState({
    id: "",
    name: "",
    description: "",
    supplier: "",
    amount: "",
    unit: "",
    price: "",
    totalPrice: "",
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

  useEffect(() => {
    const amount = parseFloat(newExpense.amount) || 0;
    const price = parseFloat(newExpense.price) || 0;
    setNewExpense((prev) => ({
      ...prev,
      totalPrice: amount * price,
    }));
  }, [newExpense.amount, newExpense.price]);

  useEffect(() => {
    const amount = parseFloat(editExpense.amount) || 0;
    const price = parseFloat(editExpense.price) || 0;
    setEditExpense((prev) => ({
      ...prev,
      totalPrice: amount * price,
    }));
  }, [editExpense.amount, editExpense.price]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save expense
  const handleSaveExpense = async () => {
    const userId = sessionStorage.getItem("userId");
    try {
      await axios.post(API_URL, {
        name: newExpense.name,
        description: newExpense.description,
        supplier: newExpense.supplier,
        amount: parseInt(newExpense.amount),
        unit: newExpense.unit,
        price: parseFloat(newExpense.price),
        totalPrice: parseFloat(newExpense.totalPrice),
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
    console.log(newExpense);
  };

  // Handle update expense
  const handleUpdateExpense = async () => {
    const userId = sessionStorage.getItem("userId");
    try {
      await axios.put(`${API_URL}/${editExpense.id}`, {
        name: editExpense.name,
        description: editExpense.description,
        supplier: editExpense.supplier,
        amount: parseInt(editExpense.amount),
        unit: editExpense.unit,
        price: parseFloat(editExpense.price),
        totalPrice: parseFloat(editExpense.totalPrice),
        date: editExpense.date,
        userId: parseInt(userId),
      });

      Swal.fire("Berhasil", "Pengeluaran berhasil diperbarui", "success");
      fetchExpenses();
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating expense:", error);
      Swal.fire("Error", "Gagal memperbarui pengeluaran", "error");
    }
  };

  // Handle open edit dialog
  const handleOpenEditDialog = (expense) => {
    setEditExpense({
      id: expense.id,
      name: expense.name,
      description: expense.description,
      supplier: expense.supplier,
      amount: expense.amount,
      unit: expense.unit,
      price: expense.price,
      totalPrice: expense.totalPrice,
      date: new Date(expense.date).toISOString().split("T")[0],
    });
    setIsEditDialogOpen(true);
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
      name: "",
      description: "",
      supplier: "",
      amount: "",
      unit: "",
      price: "",
      totalPrice: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Handle edit dialog close
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditExpense({
      id: "",
      name: "",
      description: "",
      supplier: "",
      amount: "",
      unit: "",
      price: "",
      totalPrice: "",
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
                  <Label htmlFor="name" className="text-right">
                    Nama
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newExpense.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
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
                  <Label htmlFor="supplier" className="text-right">
                    Supplier
                  </Label>
                  <Input
                    id="supplier"
                    name="supplier"
                    value={newExpense.supplier}
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
                  <Label htmlFor="unit" className="text-right">
                    Satuan
                  </Label>
                  <Input
                    id="unit"
                    name="unit"
                    value={newExpense.unit}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Harga/Pcs
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    value={newExpense.price}
                    onChange={handleInputChange}
                    className="col-span-3"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalPrice" className="text-right">
                    Total
                  </Label>
                  <Input
                    id="totalPrice"
                    name="totalPrice"
                    value={newExpense.totalPrice}
                    onChange={handleInputChange}
                    className="col-span-3"
                    type="number"
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

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Pengeluaran</DialogTitle>
                <DialogDescription>
                  Ubah informasi pengeluaran di bawah ini.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nama
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editExpense.name}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Deskripsi
                  </Label>
                  <Input
                    id="edit-description"
                    name="description"
                    value={editExpense.description}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-supplier" className="text-right">
                    Supplier
                  </Label>
                  <Input
                    id="edit-supplier"
                    name="supplier"
                    value={editExpense.supplier}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-amount" className="text-right">
                    Jumlah
                  </Label>
                  <Input
                    id="edit-amount"
                    name="amount"
                    type="number"
                    value={editExpense.amount}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-unit" className="text-right">
                    Satuan
                  </Label>
                  <Input
                    id="edit-unit"
                    name="unit"
                    value={editExpense.unit}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">
                    Harga/Pcs
                  </Label>
                  <Input
                    id="edit-price"
                    name="price"
                    value={editExpense.price}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-totalPrice" className="text-right">
                    Total
                  </Label>
                  <Input
                    id="edit-totalPrice"
                    name="totalPrice"
                    value={editExpense.totalPrice}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-date" className="text-right">
                    Tanggal
                  </Label>
                  <Input
                    id="edit-date"
                    name="date"
                    type="date"
                    value={editExpense.date}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseEditDialog}>
                  Batal
                </Button>
                <Button onClick={handleUpdateExpense}>Simpan Perubahan</Button>
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
                  <TableHead>Nama</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Harga/Pcs</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.name}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.supplier}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                    <TableCell>{expense.unit}</TableCell>
                    <TableCell>{formatCurrency(expense.price)}</TableCell>
                    <TableCell>{formatCurrency(expense.totalPrice)}</TableCell>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditDialog(expense)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
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
