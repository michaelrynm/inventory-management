import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import AdminLayout from "@/components/component/AdminLayout.jsx";
import axios from "axios";

// Dummy data untuk chart penjualan mingguan
const weeklyData = [
  { name: "Senin", penjualan: 1200000 },
  { name: "Selasa", penjualan: 900000 },
  { name: "Rabu", penjualan: 1500000 },
  { name: "Kamis", penjualan: 1100000 },
  { name: "Jumat", penjualan: 1800000 },
  { name: "Sabtu", penjualan: 2200000 },
  { name: "Minggu", penjualan: 1700000 },
];

// Dummy data untuk chart perbandingan penjualan bulanan
const monthlyData = [
  { name: "Jan", tahunLalu: 15000000, tahunIni: 18000000 },
  { name: "Feb", tahunLalu: 18000000, tahunIni: 22000000 },
  { name: "Mar", tahunLalu: 16000000, tahunIni: 19000000 },
  { name: "Apr", tahunLalu: 19000000, tahunIni: 23000000 },
  { name: "Mei", tahunLalu: 17000000, tahunIni: 25000000 },
  { name: "Jun", tahunLalu: 20000000, tahunIni: 24000000 },
];

// Dummy data untuk produk dengan stok menipis
const lowStockProducts = [
  { name: "Beras Premium", stock: 5, minimum: 10 },
  { name: "Minyak Goreng", stock: 8, minimum: 15 },
  { name: "Gula Pasir", stock: 3, minimum: 10 },
  { name: "Tepung Terigu", stock: 4, minimum: 8 },
];

export default function Dashboard() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const [dashboardData, setDashboardData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/laporan/weekly-reports"
        );
        setWeeklyData(response.data); // Menggunakan data dari API
      } catch (error) {
        console.error("Error fetching weekly sales data:", error);
      }
    };

    fetchWeeklyData();
  }, []);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/laporan/monthly-comparison"
        );
        setMonthlyData(response.data); // Menggunakan data dari API
      } catch (error) {
        console.error("Error fetching monthly sales comparison data:", error);
      }
    };

    fetchMonthlyData();
  }, []);

  useEffect(() => {
    const fetchLowStockData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/dashboard/low-stock"
        );
        setLowStockData(response.data);
      } catch (error) {
        console.log("Error fetching low stock data", error);
      }
    };

    fetchLowStockData();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/dashboard/summary"
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  console.log("dashboard data", dashboardData);

  return (
    <div>
      <AdminLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Penjualan Hari Ini
                    </p>
                    <h3 className="text-2xl font-bold">
                      {formatCurrency(dashboardData.todayRevenue)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Pelanggan
                    </p>
                    <h3 className="text-2xl font-bold">
                      {dashboardData.totalCustomer}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Produk
                    </p>
                    <h3 className="text-2xl font-bold">
                      {dashboardData.totalProducts}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Stok Menipis
                    </p>
                    <h3 className="text-2xl font-bold">
                      {dashboardData.lowStockProducts}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Penjualan Minggu Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        labelStyle={{ color: "black" }}
                      />
                      <Bar dataKey="penjualan" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Penjualan Bulanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        labelStyle={{ color: "black" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="tahunLalu"
                        stroke="#94a3b8"
                        name="Tahun Lalu"
                      />
                      <Line
                        type="monotone"
                        dataKey="tahunIni"
                        stroke="#3b82f6"
                        name="Tahun Ini"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Produk dengan Stok Menipis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Nama Produk</th>
                      <th className="px-6 py-3">Stok Tersedia</th>
                      <th className="px-6 py-3">Stok Minimum</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockData.map((product, index) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">
                          {product.name}
                        </td>
                        <td className="px-6 py-4">{product.stock}</td>
                        <td className="px-6 py-4">{product.minStock}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                            Stok Menipis
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </div>
  );
}
