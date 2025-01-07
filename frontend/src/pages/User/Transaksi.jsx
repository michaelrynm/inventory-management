import { useState } from "react";
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
import { X, Receipt, ShoppingCart, Printer, Save, RotateCcw } from "lucide-react";

export default function Transaksi() {
  // State management
  const [step, setStep] = useState(1);
  const [saleDetails, setSaleDetails] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    paymentMethod: "",
    cashier: "John Doe", // This would come from auth/context in real app
    date: new Date().toLocaleDateString(),
    transactionId: "TRX-" + Math.random().toString().slice(2, 11)
  });

  // Product form state
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  // Dummy data
  const dummyDataSelect = [
    "Beras", "Sabun", "Sampo", "Pasta Gigi", "Tissue",
    "Detergen", "Minyak Goreng", "Gula Pasir", "Kopi",
    "Teh Celup", "Susu Bubuk", "Kecap Manis", "Saos Sambal",
    "Telur Ayam", "Margarin", "Keju", "Roti Tawar",
    "Air Mineral", "Cokelat Bubuk", "Mie Instan"
  ];

  // Dummy prices (in real app, this would come from API)
  const productPrices = {
    "Beras": 75000,
    "Sabun": 10000,
    "Sampo": 25000,
    // ... add prices for all products
  };

  // Reset functions
  const resetInitialForm = () => {
    setFormData({
      ...formData,
      customer: "",
      paymentMethod: "",
      transactionId: "TRX-" + Math.random().toString().slice(2, 11)
    });
  };

  const resetProductForm = () => {
    setSelectedProduct("");
    setQuantity("");
  };

  const resetAllData = () => {
    resetInitialForm();
    resetProductForm();
    setSaleDetails([]);
    setStep(1);
  };

  // Cancel handlers
  const handleCancelStep1 = () => {
    resetInitialForm();
  };

  const handleCancelStep2 = () => {
    if (window.confirm("Anda yakin ingin kembali? Data produk yang sudah ditambahkan akan hilang.")) {
      resetProductForm();
      setSaleDetails([]);
      setStep(1);
    }
  };

  const handleCancelTransaction = () => {
    if (window.confirm("Anda yakin ingin membatalkan transaksi ini? Semua data akan dihapus.")) {
      resetAllData();
    }
  };

  // Handlers
  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (formData.customer && formData.paymentMethod) {
      setStep(2);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (selectedProduct && quantity) {
      const price = productPrices[selectedProduct] || 10000; // Default price if not found
      const newProduct = {
        id: `A${Math.random().toString().slice(2, 6)}`,
        product_name: selectedProduct,
        quantity: parseInt(quantity),
        price_per_unit: price,
        total_price: price * parseInt(quantity)
      };
      
      setSaleDetails([...saleDetails, newProduct]);
      resetProductForm();
    }
  };

  const handleDeleteProduct = (productId) => {
    setSaleDetails(saleDetails.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return saleDetails.reduce((sum, item) => sum + item.total_price, 0);
  };

  const handleFinalSubmit = () => {
    const finalTransaction = {
      ...formData,
      saleDetails,
      totalAmount: calculateTotal()
    };
    console.log("Final transaction data:", finalTransaction);
    // Here you would typically make an API call to save the transaction
  };

  return (
    <div>
      <UserLayout>
        <div className="w-full bg-white py-6 px-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-blue-500" />
              <p className="text-2xl font-semibold text-gray-800">Transaksi</p>
            </div>
            <Button
              variant="outline"
              onClick={handleCancelTransaction}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Batalkan Transaksi
            </Button>
          </div>
        </div>
        <div className="bg-white w-full mt-5 p-8 rounded-xl shadow-lg min-h-screen">
          <div className="flex items-center gap-2 text-gray-700">
            <Receipt className="w-5 h-5" />
            <p>
              <span className="font-semibold">Nota:</span>{" "}
              <span className="bg-blue-50 px-2 py-1 rounded">
                {formData.transactionId}
              </span>
            </p>
          </div>
          <Separator className="my-6" />

          {step === 1 ? (
            <form onSubmit={handleInitialSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700">Nama Pelanggan</Label>
                  <Input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({...formData, customer: e.target.value})}
                    className="focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Metode Pembayaran</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                    required
                  >
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
                  <Label className="text-gray-700">Nama Kasir</Label>
                  <Input type="text" value={formData.cashier} className="bg-gray-50" disabled />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Tanggal</Label>
                  <Input type="text" value={formData.date} className="bg-gray-50" disabled />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                >
                  Lanjutkan
                </Button>
                <Button
                  type="button"
                  onClick={handleCancelStep1}
                  variant="outline"
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Reset Form
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <p className="font-medium">Pelanggan: {formData.customer}</p>
                  <p className="text-sm text-gray-600">Metode Pembayaran: {formData.paymentMethod}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCancelStep2}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Kembali ke Form Awal
                </Button>
              </div>

              <form onSubmit={handleAddProduct} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-10 items-center">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Produk</Label>
                    <Select
                      value={selectedProduct}
                      onValueChange={setSelectedProduct}
                    >
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
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="mt-5 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                  >
                    Tambah Barang
                  </Button>
                  <Button
                    type="button"
                    onClick={resetProductForm}
                    variant="outline"
                    className="mt-5 text-gray-600 hover:bg-gray-50"
                  >
                    Reset Form
                  </Button>
                </div>
              </form>

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
                    {saleDetails.map((item) => (
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
                          <button
                            onClick={() => handleDeleteProduct(item.id)}
                            className="p-1 hover:bg-red-50 rounded-full text-red-500 transition-colors duration-200"
                          >
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
                        Rp {calculateTotal().toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleFinalSubmit}
                  disabled={saleDetails.length === 0}
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <Save size={18} />
                  Simpan Transaksi
                </Button>
                <Button
                  variant="outline"
                  disabled={saleDetails.length === 0}
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <Printer size={18} />
                  Cetak Nota
                </Button>
              </div>
            </>
          )}
        </div>
      </UserLayout>
    </div>
  );
}