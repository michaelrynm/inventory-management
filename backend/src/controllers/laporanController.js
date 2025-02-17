const { PrismaClient } = require("@prisma/client");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const prisma = new PrismaClient();

// Controller to get chart data
exports.getReportData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const salesData = await prisma.sale.groupBy({
      by: ["createdAt"],
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get expenses data for current year
    const expensesData = await prisma.expense.groupBy({
      by: ["date"],
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Initialize monthly data arrays
    const monthlyData = Array.from({ length: 12 }, () => ({
      sales: 0,
      expenses: 0,
    }));

    // Aggregate sales data by month
    salesData.forEach((data) => {
      const month = new Date(data.createdAt).getMonth();
      monthlyData[month].sales += data._sum.totalAmount || 0;
    });

    // Aggregate expenses data by month
    expensesData.forEach((data) => {
      const month = new Date(data.date).getMonth();
      monthlyData[month].expenses += data._sum.amount || 0;
    });

    // Get data for pie chart: Distribution of product sales
    const productSales = await prisma.saleDetail.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
    });

    const pieChartLabels = await Promise.all(
      productSales.map(async (data) => {
        const product = await prisma.product.findUnique({
          where: { id: data.productId },
        });
        return product?.name || "Unknown";
      })
    );
    const pieChartData = productSales.map((data) => data._sum.quantity || 0);

    // Format all chart data
    res.json({
      barChartData: {
        labels: [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ],
        datasets: [
          {
            label: "Pendapatan",
            data: monthlyData.map((data) => data.sales),
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
          {
            label: "Pengeluaran",
            data: monthlyData.map((data) => data.expenses),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      },
      pieChartData: {
        labels: pieChartLabels,
        datasets: [
          {
            data: pieChartData,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          },
        ],
      },
      currentYear,
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.status(500).json({ error: "Failed to fetch report data" });
  }
};

exports.getWeeklySalesData = async (req, res) => {
  const dayOrder = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];
  try {
    const today = new Date();
    let weeklySales = [];

    // Ambil data selama 7 hari terakhir
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const start = startOfDay(date);
      const end = endOfDay(date);

      // Ambil total penjualan untuk hari tersebut
      const sales = await prisma.sale.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
      });

      // Dapatkan nama hari dalam bahasa Indonesia
      const dayName = start.toLocaleDateString("id-ID", { weekday: "long" });

      weeklySales.push({
        day: dayName,
        totalSales: sales._sum.totalAmount || 0,
      });
    }

    // **Sort data berdasarkan urutan hari yang benar (mulai dari Senin)**
    weeklySales.sort((a, b) => {
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });

    res.json({ success: true, data: weeklySales });
  } catch (error) {
    console.error("Error fetching weekly sales:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getMonthlySalesComparison = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const salesThisYear = await prisma.sale.groupBy({
      by: ["createdAt"],
      _sum: { totalAmount: true },
    });

    const salesLastYear = await prisma.sale.groupBy({
      by: ["createdAt"],
      _sum: { totalAmount: true },
      where: {
        createdAt: {
          gte: new Date(`${lastYear}-01-01`),
          lte: new Date(`${lastYear}-12-31`),
        },
      },
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i + 1).toLocaleString("id-ID", { month: "short" }),
      tahunLalu: 0,
      tahunIni: 0,
    }));

    salesThisYear.forEach((sale) => {
      const month = new Date(sale.createdAt).getMonth();
      monthlyData[month].tahunIni += sale._sum.totalAmount || 0;
    });

    salesLastYear.forEach((sale) => {
      const month = new Date(sale.createdAt).getMonth();
      monthlyData[month].tahunLalu += sale._sum.totalAmount || 0;
    });

    res.status(200).json(monthlyData);
  } catch (error) {
    console.error("Error fetching monthly sales comparison data:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch monthly sales comparison data" });
  }
};
