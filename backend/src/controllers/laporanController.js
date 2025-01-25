const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Controller to get chart data
exports.getReportData = async (req, res) => {
  try {
    // Get data for bar chart: Pendapatan (Sales) and Pengeluaran (Expenses)
    const salesData = await prisma.sale.groupBy({
      by: ["createdAt"],
      _sum: {
        totalAmount: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const expensesData = await prisma.expense.groupBy({
      by: ["date"],
      _sum: {
        amount: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Format data for bar chart
    const barChartLabels = salesData.map((data) =>
      new Date(data.createdAt).toLocaleString("default", { month: "long" })
    );
    const barChartSales = salesData.map((data) => data._sum.totalAmount || 0);
    const barChartExpenses = expensesData.map((data) => data._sum.amount || 0);

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

    // Return formatted data
    res.json({
      barChartData: {
        labels: barChartLabels,
        datasets: [
          {
            label: "Pendapatan",
            data: barChartSales,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
          {
            label: "Pengeluaran",
            data: barChartExpenses,
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
