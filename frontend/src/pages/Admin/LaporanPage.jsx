import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/component/AdminLayout";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Dummy Data (sama seperti sebelumnya)
const barChartData = {
  labels: ["Januari", "Februari", "Maret", "April", "Mei"],
  datasets: [
    {
      label: "Pendapatan",
      data: [500000, 700000, 1200000, 1000000, 1500000],
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
    {
      label: "Pengeluaran",
      data: [300000, 500000, 800000, 700000, 1100000],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const pieChartData = {
  labels: ["Produk A", "Produk B", "Produk C", "Produk D"],
  datasets: [
    {
      data: [300, 500, 100, 200],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
    },
  ],
};

const lineChartData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Kunjungan Pelanggan",
      data: [50, 75, 100, 125],
      borderColor: "#36A2EB",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      fill: true,
    },
  ],
};

const doughnutChartData = {
  labels: ["Active", "Inactive"],
  datasets: [
    {
      data: [80, 20],
      backgroundColor: ["#4BC0C0", "#FF6384"],
    },
  ],
};

// Chart options dengan ID unik
const getChartOptions = (id) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
  },
  id: id, // Menambahkan ID unik
});

export default function ReportPage() {
  // Refs untuk setiap chart
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);

  // Cleanup function untuk destroy charts
  useEffect(() => {
    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
      }
    };
  }, []);

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard Laporan</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Pendapatan dan Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <Bar
                ref={barChartRef}
                data={barChartData}
                options={getChartOptions("bar-chart")}
              />
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Penjualan Produk</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <Pie
                ref={pieChartRef}
                data={pieChartData}
                options={getChartOptions("pie-chart")}
              />
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Kunjungan Pelanggan Mingguan</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <Line
                ref={lineChartRef}
                data={lineChartData}
                options={getChartOptions("line-chart")}
              />
            </CardContent>
          </Card>

          {/* Doughnut Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Status Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <Doughnut
                ref={doughnutChartRef}
                data={doughnutChartData}
                options={getChartOptions("doughnut-chart")}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
