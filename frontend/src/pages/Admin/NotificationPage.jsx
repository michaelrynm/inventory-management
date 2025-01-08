import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/component/AdminLayout";
import { AlertCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Fungsi untuk mengambil data stok rendah
const fetchLowStockProducts = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/dashboard/low-stock"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return [];
  }
};

export default function NotificationPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const lowStockProducts = await fetchLowStockProducts();
        setProducts(lowStockProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
      setLoading(false);
    };

    loadProducts();

    // Polling untuk mengecek stok setiap 5 menit
    const intervalId = setInterval(loadProducts, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Fungsi untuk membuka halaman detail produk
  const openProductDetail = (product) => {
    navigate("/admin/products/")
    console.log("Navigate to product:", product);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Memuat data produk...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Notifikasi Stok Menipis</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk dengan Stok Menipis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada produk dengan stok menipis
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-start justify-between p-4 rounded-lg border bg-gray-50"
                  >
                    <div className="flex gap-4">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">
                          Stok produk "{product.name}" tinggal {product.stock}{" "}
                          {product.unit}
                          {product.minStock &&
                            ` (minimum: ${product.minStock} ${product.unit})`}
                        </p>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm text-blue-500 mt-1"
                          onClick={() => openProductDetail(product)}
                        >
                          <Package className="h-4 w-4 mr-1" />
                          Lihat Detail Produk
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
