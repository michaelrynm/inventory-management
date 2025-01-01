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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pencil, Package } from "lucide-react";
import AdminLayout from "@/components/component/AdminLayout.jsx";

// Dummy data untuk produk
const initialProducts = [
  {
    id: 1,
    kode: "BRG001",
    nama: "Beras Premium",
    kategori: "Bahan Pokok",
    harga: 75000,
    stok: 50,
    minimum_stok: 10,
    satuan: "kg",
  },
  {
    id: 2,
    kode: "BRG002",
    nama: "Minyak Goreng",
    kategori: "Bahan Pokok",
    harga: 45000,
    stok: 30,
    minimum_stok: 15,
    satuan: "liter",
  },
  {
    id: 3,
    kode: "BRG003",
    nama: "Gula Pasir",
    kategori: "Bahan Pokok",
    harga: 16000,
    stok: 45,
    minimum_stok: 20,
    satuan: "kg",
  },
];

export default function ProductManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    kode: "",
    nama: "",
    kategori: "",
    harga: "",
    stok: "",
    minimum_stok: "",
    satuan: "",
  });

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Handle search
  const filteredProducts = products.filter((product) =>
    product.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle add/edit product
  const handleSaveProduct = () => {
    if (selectedProduct) {
      // Edit existing product
      setProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, ...newProduct }
            : product
        )
      );
    } else {
      // Add new product
      setProducts((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          ...newProduct,
        },
      ]);
    }
    handleCloseDialog();
  };

  // Handle edit button click
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setNewProduct(product);
    setIsAddDialogOpen(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setSelectedProduct(null);
    setNewProduct({
      kode: "",
      nama: "",
      kategori: "",
      harga: "",
      stok: "",
      minimum_stok: "",
      satuan: "",
    });
  };

  return (
    <div>
      <AdminLayout>
        <div className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Produk</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Produk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedProduct ? "Edit Produk" : "Tambah Produk Baru"}
                  </DialogTitle>
                  <DialogDescription>
                    Masukkan informasi produk di bawah ini.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kode" className="text-right">
                      Kode
                    </Label>
                    <Input
                      id="kode"
                      name="kode"
                      value={newProduct.kode}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nama" className="text-right">
                      Nama
                    </Label>
                    <Input
                      id="nama"
                      name="nama"
                      value={newProduct.nama}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kategori" className="text-right">
                      Kategori
                    </Label>
                    <Input
                      id="kategori"
                      name="kategori"
                      value={newProduct.kategori}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="harga" className="text-right">
                      Harga
                    </Label>
                    <Input
                      id="harga"
                      name="harga"
                      type="number"
                      value={newProduct.harga}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stok" className="text-right">
                      Stok
                    </Label>
                    <Input
                      id="stok"
                      name="stok"
                      type="number"
                      value={newProduct.stok}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="minimum_stok" className="text-right">
                      Minimum Stok
                    </Label>
                    <Input
                      id="minimum_stok"
                      name="minimum_stok"
                      type="number"
                      value={newProduct.minimum_stok}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="satuan" className="text-right">
                      Satuan
                    </Label>
                    <Input
                      id="satuan"
                      name="satuan"
                      value={newProduct.satuan}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
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
                <CardTitle>Daftar Produk</CardTitle>
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
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.kode}</TableCell>
                      <TableCell className="font-medium">
                        {product.nama}
                      </TableCell>
                      <TableCell>{product.kategori}</TableCell>
                      <TableCell>{formatCurrency(product.harga)}</TableCell>
                      <TableCell>{product.stok}</TableCell>
                      <TableCell>{product.satuan}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stok <= product.minimum_stok
                              ? "destructive"
                              : "success"
                          }
                        >
                          {product.stok <= product.minimum_stok
                            ? "Stok Menipis"
                            : "Stok Aman"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(product)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </div>
  );
}
