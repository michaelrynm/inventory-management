import { useState, useEffect } from "react";
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
import {
  X,
  Receipt,
  ShoppingCart,
  Printer,
  Save,
  RotateCcw,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Transaksi() {
  const [saleId, setSaleId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [saleDetails, setSaleDetails] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    paymentMethod: "",
    cashier: "John Doe",
    date: "",
    transactionId: "TRX-" + Math.random().toString().slice(2, 11),
    userId: sessionStorage.getItem("userId"),
  });

  const [userData, setUserData] = useState({});

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const response = await axios.get(
          `https://inventory-management-orpin-six.vercel.app/api/users/${userId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.log("Error fetch user Data");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://inventory-management-orpin-six.vercel.app/api/products"
        );
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      if (!saleId) return;

      try {
        const response = await axios.get(
          `https://inventory-management-orpin-six.vercel.app/api/sale-details/${saleId}`
        );
        setSaleDetails(
          response.data.map((detail) => ({
            id: detail.id,
            product_name: detail.name,
            quantity: detail.quantity,
            price_per_unit: detail.price,
            total_price: detail.totalPrice,
          }))
        );
      } catch (error) {
        console.error("Error fetching sale details:", error);
        setError("Failed to fetch sale details");
      }
    };

    fetchSaleDetails();
  }, [saleId]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (selectedProduct && quantity && saleId) {
      try {
        const response = await axios.post(
          "https://inventory-management-orpin-six.vercel.app/api/sale-details",
          {
            saleId: parseInt(saleId),
            productId: selectedProduct.id,
            quantity: parseInt(quantity),
          }
        );

        if (response.status === 201) {
          const updatedDetailsResponse = await axios.get(
            `https://inventory-management-orpin-six.vercel.app/api/sale-details/${saleId}`
          );

          setSaleDetails(
            updatedDetailsResponse.data.map((detail) => ({
              id: detail.id,
              product_name: detail.name,
              quantity: detail.quantity,
              price_per_unit: detail.price,
              total_price: detail.totalPrice,
            }))
          );

          resetProductForm();
        }
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product. Please try again.");
      }
    }
  };

  const resetInitialForm = () => {
    setFormData({
      ...formData,
      customer: "",
      paymentMethod: "",
      transactionId: "TRX-" + Math.random().toString().slice(2, 11),
      date: "",
    });
  };

  const resetProductForm = () => {
    setSelectedProduct(null);
    setQuantity("");
  };

  const resetAllData = () => {
    resetInitialForm();
    resetProductForm();
    setSaleDetails([]);
    setStep(1);
  };

  const calculateTotal = () => {
    return saleDetails.reduce((sum, item) => sum + item.total_price, 0);
  };

  const handleCancelStep1 = () => {
    resetInitialForm();
  };

  const handleCancelStep2 = () => {
    if (
      window.confirm(
        "Anda yakin ingin kembali? Data produk yang sudah ditambahkan akan hilang."
      )
    ) {
      resetProductForm();
      setSaleDetails([]);
      setStep(1);
    }
  };

  const handleCancelTransaction = async () => {
    if (!saleId) return;

    const result = await Swal.fire({
      title: "Batalkan Transaksi?",
      text: "Apakah Anda yakin ingin membatalkan transaksi ini? Data yang sudah dimasukkan akan dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Batalkan!",
      cancelButtonText: "Tidak",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Menghapus transaksi...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await axios.delete(
          `https://inventory-management-orpin-six.vercel.app/api/sales/${saleId}`
        );

        // Reset state setelah transaksi dibatalkan
        resetAllData();

        Swal.fire({
          icon: "success",
          title: "Transaksi Dibatalkan",
          text: "Transaksi telah berhasil dibatalkan.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error cancelling transaction:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Membatalkan Transaksi",
          text: "Terjadi kesalahan saat menghapus transaksi.",
        });
      }
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (formData.customer && formData.paymentMethod) {
      try {
        const parsedDate = new Date(formData.date).toISOString();
        const response = await axios.post(
          "https://inventory-management-orpin-six.vercel.app/api/sales/",
          {
            userId: formData.userId,
            customer: formData.customer,
            paymentMethod: formData.paymentMethod,
            date: parsedDate,
          }
        );

        if (response.status === 201) {
          setSaleId(response.data.id);
          setStep(2);
        }
      } catch (error) {
        console.error("Error creating sale:", error);
        alert("Failed to create sale. Please try again.");
      }
    }
  };

  const handleDeleteProduct = async (saleDetailId) => {
    if (!saleDetailId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID Produk tidak ditemukan",
      });
      return;
    }

    try {
      // First, confirm with user using SweetAlert2
      const result = await Swal.fire({
        title: "Hapus Produk",
        text: "Apakah Anda yakin ingin menghapus produk ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      // If user confirms the deletion
      if (result.isConfirmed) {
        // Show loading state
        Swal.fire({
          title: "Menghapus produk...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Send DELETE request to the API
        const deleteResponse = await axios.delete(
          `https://inventory-management-orpin-six.vercel.app/api/sale-details/${saleDetailId}`
        );

        if (deleteResponse.status === 200) {
          // Fetch updated sale details after successful deletion
          const updatedDetailsResponse = await axios.get(
            `https://inventory-management-orpin-six.vercel.app/api/sale-details/${saleId}`
          );

          // Update the state with new data
          setSaleDetails(
            updatedDetailsResponse.data.map((detail) => ({
              id: detail.id,
              product_name: detail.name,
              quantity: detail.quantity,
              price_per_unit: detail.price,
              total_price: detail.totalPrice,
            }))
          );

          // Show success message
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Produk berhasil dihapus",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);

      let errorMessage = "Terjadi kesalahan saat menghapus produk";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 404:
            errorMessage = "Data produk tidak ditemukan";
            break;
          case 403:
            errorMessage =
              "Anda tidak memiliki izin untuk menghapus produk ini";
            break;
          default:
            errorMessage = `Gagal menghapus produk. Status: ${error.response.status}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Tidak dapat terhubung ke server. Silakan coba lagi.";
      }

      // Show error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  const handleFinalSubmit = async () => {
    const finalTransaction = {
      ...formData,
      saleDetails,
      totalAmount: calculateTotal(),
    };

    try {
      // Kirim data transaksi ke API
      const response = await axios.put(
        "https://inventory-management-orpin-six.vercel.app/api/sales/",
        {
          saleId: parseInt(saleId),
        }
      );

      if (response.status === 200) {
        // Jika transaksi berhasil, tampilkan notifikasi sukses
        await Swal.fire({
          icon: "success",
          title: "Transaksi Berhasil Disimpan",
          text: "Transaksi telah berhasil disimpan ke database.",
        });

        // Reset semua data
        resetAllData();
      }
    } catch (error) {
      // Jika ada kesalahan, tampilkan notifikasi error
      console.error("Error submitting final transaction:", error);

      let errorMessage = "Terjadi kesalahan saat menyimpan transaksi.";

      if (error.response) {
        // Error dari server dengan status code
        switch (error.response.status) {
          case 400:
            errorMessage =
              "Data transaksi tidak valid. Periksa kembali formulir.";
            break;
          case 404:
            errorMessage = "Transaksi tidak ditemukan. Silakan coba lagi.";
            break;
          case 500:
            errorMessage =
              "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
            break;
          default:
            errorMessage = `Gagal menyimpan transaksi. Status: ${error.response.status}`;
        }
      } else if (error.request) {
        // Tidak ada respons dari server
        errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
      }

      // Tampilkan error menggunakan SweetAlert2
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
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
              disabled={step === 1}
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
                    onChange={(e) =>
                      setFormData({ ...formData, customer: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Metode Pembayaran</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentMethod: value })
                    }
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
                  <Input
                    type="text"
                    value={userData.name}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Tanggal</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-blue-100"
                    required
                  />
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
                  <p className="text-sm text-gray-600">
                    Metode Pembayaran: {formData.paymentMethod}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCancelStep2}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Kembali ke Form Awal
                </Button>
              </div>

              <form
                onSubmit={handleAddProduct}
                className="bg-gray-50 p-6 rounded-lg border border-gray-100"
              >
                <div className="grid grid-cols-2 gap-10 items-center">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Produk</Label>
                    <Select
                      value={selectedProduct?.id || ""}
                      onValueChange={(id) => {
                        if (["loading", "error", "empty"].includes(id)) return;

                        const selected = products.find((p) => p.id === id);
                        if (selected) {
                          setSelectedProduct(selected);
                        } else {
                          console.error("Produk tidak ditemukan untuk ID:", id);
                        }
                      }}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-blue-100">
                        <SelectValue placeholder="Pilih Produk">
                          {selectedProduct?.name || "Pilih Produk"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <SelectItem value="loading" disabled>
                            Memuat produk...
                          </SelectItem>
                        ) : error ? (
                          <SelectItem value="error" disabled>
                            Gagal memuat produk
                          </SelectItem>
                        ) : products.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            Tidak ada produk tersedia
                          </SelectItem>
                        ) : (
                          products
                            .filter((product) => product.id && product.name)
                            .map((product) => (
                              <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                              >
                                {product.name} - Rp{" "}
                                {product.price.toLocaleString("id-ID")}
                              </SelectItem>
                            ))
                        )}
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
                      <TableHead className="font-semibold">
                        Nama Barang
                      </TableHead>
                      <TableHead className="font-semibold">
                        Jumlah Barang
                      </TableHead>
                      <TableHead className="font-semibold">
                        Harga Satuan
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Harga Total
                      </TableHead>
                      <TableHead className="text-center w-[50px]">
                        Action
                      </TableHead>
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
                            title="Hapus produk"
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
                      <TableCell
                        className="text-right font-semibold"
                        colSpan={2}
                      >
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
