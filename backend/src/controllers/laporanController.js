const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Controller to get chart data
exports.getReportData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // January 1st of current year
    const endDate = new Date(currentYear, 11, 31); // December 31st of current year

    // Get sales data for current year
    const salesData = await prisma.sale.groupBy({
      by: ['createdAt'],
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
        createdAt: 'asc',
      },
    });

    // Get expenses data for current year
    const expensesData = await prisma.expense.groupBy({
      by: ['date'],
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
        date: 'asc',
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
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ],
        datasets: [
          {
            label: 'Pendapatan',
            data: monthlyData.map(data => data.sales),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: 'Pengeluaran',
            data: monthlyData.map(data => data.expenses),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
  try {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 1)
    ); // Monday
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6)); // Sunday

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    const weeklyData = [
      { name: "Senin", penjualan: 0 },
      { name: "Selasa", penjualan: 0 },
      { name: "Rabu", penjualan: 0 },
      { name: "Kamis", penjualan: 0 },
      { name: "Jumat", penjualan: 0 },
      { name: "Sabtu", penjualan: 0 },
      { name: "Minggu", penjualan: 0 },
    ];

    sales.forEach((sale) => {
      const day = new Date(sale.createdAt).getDay();
      weeklyData[day - 1].penjualan += sale.totalAmount || 0;
    });

    res.status(200).json(weeklyData);
  } catch (error) {
    console.error("Error fetching weekly sales data:", error);
    res.status(500).json({ error: "Failed to fetch weekly sales data" });
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
