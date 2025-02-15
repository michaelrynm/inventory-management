import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/component/AdminLayout";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";

// Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportPage() {
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/laporan");
        const data = response.data;

        // Set the chart data from API response
        setBarChartData(data.barChartData);
        setPieChartData(data.pieChartData);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Bar Chart options with currency formatting
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumSignificantDigits: 3,
            }).format(value);
          },
        },
      },
    },
  };

  // Pie Chart options
  const pieChartOptions = {
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
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center">Loading data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard Laporan</h1>
        </div>

        <div className="">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>
                Perbandingan Pendapatan dan Pengeluaran Bulanan
              </CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              {barChartData ? (
                <Bar data={barChartData} options={barChartOptions} />
              ) : (
                <div className="text-center">No data available</div>
              )}
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <div className="mt-5">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Penjualan Produk</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                {pieChartData ? (
                  <Pie data={pieChartData} options={pieChartOptions} />
                ) : (
                  <div className="text-center">No data available</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
