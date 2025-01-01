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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  UserCircle,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/components/component/AdminLayout.jsx";

// Dummy data pelanggan
const initialCustomers = [
  {
    id: "CST001",
    name: "Ahmad Rizki",
    phone: "081234567890",
    email: "ahmad@example.com",
    address: "Jl. Sudirman No. 123, Jakarta",
    totalTransactions: 15,
    totalSpent: 2500000,
    status: "active",
    transactions: [
      {
        id: "TRX001",
        date: "2024-01-01",
        total: 150000,
        items: [
          { product: "Beras Premium", qty: 2, price: 75000, total: 150000 },
        ],
      },
    ],
  },
  {
    id: "CST002",
    name: "Siti Rahayu",
    phone: "087654321098",
    email: "siti@example.com",
    address: "Jl. Thamrin No. 45, Jakarta",
    totalTransactions: 8,
    totalSpent: 1800000,
    status: "active",
    transactions: [
      {
        id: "TRX002",
        date: "2024-01-02",
        total: 85000,
        items: [
          { product: "Minyak Goreng", qty: 1, price: 45000, total: 45000 },
          { product: "Gula Pasir", qty: 2, price: 20000, total: 40000 },
        ],
      },
    ],
  },
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentTab, setCurrentTab] = useState("info");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      dateStyle: "medium",
    });
  };

  // Handle search and filters
  const filteredCustomers = customers.filter((customer) => {
    const matchSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true : customer.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = () => {
    if (selectedCustomer) {
      // Edit existing customer
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === selectedCustomer.id
            ? { ...customer, ...formData }
            : customer
        )
      );
    } else {
      // Add new customer
      const newCustomer = {
        id: `CST${String(customers.length + 1).padStart(3, "0")}`,
        ...formData,
        totalTransactions: 0,
        totalSpent: 0,
        status: "active",
        transactions: [],
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    handleCloseForm();
  };

  // Handle edit customer
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
    setIsFormOpen(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCustomer(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  // Handle view detail
  const handleViewDetail = (customer) => {
    setSelectedCustomer(customer);
    setCurrentTab("info");
    setIsDetailOpen(true);
  };

  return (
    <div>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Pelanggan</h1>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pelanggan
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Pelanggan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari pelanggan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status Pelanggan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Pelanggan</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pelanggan</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Total Transaksi</TableHead>
                    <TableHead>Total Belanja</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.id}
                      </TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-1" />
                            {customer.phone}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <Mail className="w-3 h-3 mr-1" />
                            {customer.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{customer.totalTransactions}</TableCell>
                      <TableCell>
                        {formatCurrency(customer.totalSpent)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            customer.status === "active"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {customer.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(customer)}
                          >
                            Detail
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Form Dialog */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedCustomer
                    ? "Edit Pelanggan"
                    : "Tambah Pelanggan Baru"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="name">Nama Pelanggan</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama pelanggan"
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="phone">No. Telepon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat email"
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseForm}>
                  Batal
                </Button>
                <Button onClick={handleSubmit}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Detail Dialog */}
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Detail Pelanggan</DialogTitle>
              </DialogHeader>
              {selectedCustomer && (
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList>
                    <TabsTrigger value="info">Informasi</TabsTrigger>
                    <TabsTrigger value="transactions">
                      Riwayat Transaksi
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">ID Pelanggan</p>
                        <p className="font-medium">{selectedCustomer.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nama</p>
                        <p className="font-medium">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">No. Telepon</p>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedCustomer.email}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Alamat</p>
                        <p className="font-medium">
                          {selectedCustomer.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Transaksi</p>
                        <p className="font-medium">
                          {selectedCustomer.totalTransactions}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Belanja</p>
                        <p className="font-medium">
                          {formatCurrency(selectedCustomer.totalSpent)}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="transactions">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Transaksi</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCustomer.transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {transaction.id}
                            </TableCell>
                            <TableCell>
                              {formatDate(transaction.date)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(transaction.total)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </div>
  );
}
