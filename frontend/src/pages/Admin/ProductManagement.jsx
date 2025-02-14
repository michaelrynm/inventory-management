import React, { useState, useEffect } from "react";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pencil, Trash, Download } from "lucide-react";
import AdminLayout from "@/components/component/AdminLayout.jsx";
import axios from "axios";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

const API_URL = "http://localhost:3000/api/products";

export default function ProductManagement() {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    minStock: "",
    unit: "",
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire("Error", "Gagal mengambil data produk", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save product
  const handleSaveProduct = async () => {
    try {
      const formattedProduct = {
        ...newProduct,
        price: parseInt(newProduct.price, 10),
        stock: parseInt(newProduct.stock, 10),
        minStock: parseInt(newProduct.minStock, 10),
      };

      if (selectedProduct) {
        // Update product
        await axios.put(`${API_URL}/${selectedProduct.id}`, formattedProduct, {
          headers: { "Content-Type": "application/json" },
        });
        Swal.fire("Berhasil", "Produk berhasil diperbarui", "success");
      } else {
        // Add new product
        await axios.post(API_URL, formattedProduct, {
          headers: { "Content-Type": "application/json" },
        });
        Swal.fire("Berhasil", "Produk berhasil ditambahkan", "success");
      }
      fetchProducts();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire("Error", "Gagal menyimpan produk", "error");
    }
  };

  // Handle edit click
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setNewProduct(product);
    setIsAddDialogOpen(true);
  };

  // Handle delete product
  const handleDeleteProduct = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Produk yang dihapus tidak dapat dikembalikan!",
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
          fetchProducts();
          Swal.fire("Berhasil", "Produk berhasil dihapus", "success");
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire("Error", "Gagal menghapus produk", "error");
        }
      }
    });
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setSelectedProduct(null);
    setNewProduct({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      minStock: "",
      unit: "",
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(filteredProducts);

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct ? "Edit Produk" : "Tambah Produk Baru"}
                </DialogTitle>
                <DialogDescription>
                  Masukkan informasi produk di bawah ini.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {Object.keys(newProduct)
                  .filter((field) => !["id", "createdAt"].includes(field)) // Exclude fields
                  .map((field) => (
                    <div
                      key={field}
                      className="grid grid-cols-4 items-center gap-4"
                    >
                      <Label htmlFor={field} className="text-right">
                        {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                        {/* Capitalize */}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        value={newProduct[field]}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  ))}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Batal
                </Button>
                <Button onClick={handleSaveProduct}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-red-800">Daftar Produk</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari produk..."
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
                  <TableHead>Merk</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>{product.minStock}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.stock <= product.minStock
                            ? "destructive"
                            : "success"
                        }
                      >
                        {product.stock <= product.minStock
                          ? "Stok Menipis"
                          : "Stok Aman"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(product)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <CSVLink
                  data={filteredProducts}
                  filename="Data Produk"
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
      </div>
    </AdminLayout>
  );
}
