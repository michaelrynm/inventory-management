import React from "react";
import { Package, ShoppingCart, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Package className="w-10 h-10 text-blue-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Toko Lion
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Sistem Manajemen Toko</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-stretch">
        <Card className="flex-1 group hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="p-8 flex flex-col items-center h-full border-2 border-transparent hover:border-blue-500 rounded-lg">
            <div className="p-4 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Login Sebagai Kasir
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Akses sistem kasir untuk mengelola transaksi dan penjualan harian
            </p>
            <Button
              className="w-full mt-auto bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/user/login")}
            >
              Masuk sebagai Kasir
            </Button>
          </div>
        </Card>

        <Card className="flex-1 group hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="p-8 flex flex-col items-center h-full border-2 border-transparent hover:border-indigo-500 rounded-lg">
            <div className="p-4 bg-indigo-100 rounded-full mb-6 group-hover:bg-indigo-200 transition-colors">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Login Sebagai Admin
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Kelola inventori, laporan, dan pengaturan sistem toko
            </p>
            <Button
              className="w-full mt-auto bg-indigo-600 hover:bg-indigo-700"
              onClick={() => navigate("/admin/login")}
            >
              Masuk sebagai Admin
            </Button>
          </div>
        </Card>
      </div>

      <footer className="mt-16 text-center text-gray-500">
        <p className="text-sm">© 2025 Toko Lion. All rights reserved.</p>
      </footer>
    </div>
  );
}
