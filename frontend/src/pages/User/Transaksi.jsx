import UserLayout from "@/components/component/UserLayout.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button.jsx";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { X, Receipt, ShoppingCart, Printer, Save } from "lucide-react";

export default function Transaksi() {
  const dummyDataSelect = [
    "Beras",
    "Sabun",
    "Sampo",
    "Pasta Gigi",
    "Tissue",
    "Detergen",
    "Minyak Goreng",
    "Gula Pasir",
    "Kopi",
    "Teh Celup",
    "Susu Bubuk",
    "Kecap Manis",
    "Saos Sambal",
    "Telur Ayam",
    "Margarin",
    "Keju",
    "Roti Tawar",
    "Air Mineral",
    "Cokelat Bubuk",
    "Mie Instan",
  ];

  const dummyTableData = [
    {
      id: "A001",
      product_name: "Sabun Mandi",
      quantity: 3,
      price_per_unit: 10000,
      total_price: 30000,
    },
    {
      id: "A002",
      product_name: "Beras Premium",
      quantity: 2,
      price_per_unit: 75000,
      total_price: 150000,
    },
    {
      id: "A003",
      product_name: "Minyak Goreng",
      quantity: 4,
      price_per_unit: 25000,
      total_price: 100000,
    },
    {
      id: "A004",
      product_name: "Susu Bubuk",
      quantity: 1,
      price_per_unit: 45000,
      total_price: 45000,
    },
    {
      id: "A005",
      product_name: "Mie Instan",
      quantity: 12,
      price_per_unit: 3500,
      total_price: 42000,
    },
    {
      id: "A006",
      product_name: "Telur Ayam",
      quantity: 2,
      price_per_unit: 28000,
      total_price: 56000,
    },
    {
      id: "A007",
      product_name: "Gula Pasir",
      quantity: 3,
      price_per_unit: 15000,
      total_price: 45000,
    },
    {
      id: "A008",
      product_name: "Kecap Manis",
      quantity: 2,
      price_per_unit: 12000,
      total_price: 24000,
    },
    {
      id: "A009",
      product_name: "Detergen",
      quantity: 1,
      price_per_unit: 35000,
      total_price: 35000,
    },
    {
      id: "A010",
      product_name: "Air Mineral",
      quantity: 2,
      price_per_unit: 22000,
      total_price: 44000,
    },
  ];

  return (
    <div>
      <UserLayout>
        <div className="w-full bg-white py-6 px-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-500" />
            <p className="text-2xl font-semibold text-gray-800">Transaksi</p>
          </div>
        </div>
        <div className="bg-white w-full mt-5 p-8 rounded-xl shadow-lg min-h-screen">
          <div className="flex items-center gap-2 text-gray-700">
            <Receipt className="w-5 h-5" />
            <p>
              <span className="font-semibold">Nota:</span>{" "}
              <span className="bg-blue-50 px-2 py-1 rounded">
                TRX-271428919
              </span>
            </p>
          </div>
          <Separator className="my-6" />
          <div>
            <form action="">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700">Nama Pelanggan</Label>
                  <Input
                    type="text"
                    className="focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Nama Kasir</Label>
                  <Input type="text" className="bg-gray-50" disabled />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Tanggal</Label>
                  <Input
                    type="text"
                    className="focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Metode Pembayaran</Label>
                  <Select>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-100">
                      <SelectValue placeholder="Pilih Metode Pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="debit">Debit</SelectItem>
                      <SelectItem value="kredit">Kredit</SelectItem>
                      <SelectItem value="qris">Qris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Diskon (%)</Label>
                  <Input
                    type="number"
                    className="focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-8 border border-gray-100">
                <div className="grid grid-cols-2 gap-10 items-center">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Produk</Label>
                    <Select>
                      <SelectTrigger className="focus:ring-2 focus:ring-blue-100">
                        <SelectValue placeholder="Pilih Produk" />
                      </SelectTrigger>
                      <SelectContent>
                        {dummyDataSelect.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Qty</Label>
                    <Input
                      type="number"
                      className="focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="mt-5 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                  >
                    Tambah Barang
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-10">
            <Table>
              <TableCaption>Daftar item transaksi</TableCaption>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[150px] font-semibold">
                    Kode Barang
                  </TableHead>
                  <TableHead className="font-semibold">Nama Barang</TableHead>
                  <TableHead className="font-semibold">Jumlah Barang</TableHead>
                  <TableHead className="font-semibold">Harga Satuan</TableHead>
                  <TableHead className="text-right font-semibold">
                    Harga Total
                  </TableHead>
                  <TableHead className="text-center w-[50px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyTableData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.price_per_unit.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.total_price.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <button className="p-1 hover:bg-red-50 rounded-full text-red-500 transition-colors duration-200">
                        <X size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-gray-50">
                <TableRow>
                  <TableCell colSpan={4} className="font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-semibold" colSpan={2}>
                    Rp 250.000
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <div className="mt-8 flex gap-3">
            <Button
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <Save size={18} />
              Simpan Transaksi
            </Button>
            <Button
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <Printer size={18} />
              Cetak Nota
            </Button>
          </div>
        </div>
      </UserLayout>
    </div>
  );
}
