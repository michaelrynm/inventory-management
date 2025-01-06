const { skip } = require("@prisma/client/runtime/library");
const prisma = require("../prisma/client.js");

exports.getSummary = async (req, res) => {
	try {
		const today = new Date().toISOString().split("T")[0];

		const todaySaleData = await prisma.sale.findMany({
			where: {
				createdAt: {
					gte: new Date(today), // Greater than or equal to today's start
					lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)), // Less than tomorrow's start
				},
			},
		});

		const todayRevenue = todaySaleData.reduce(
			(sum, record) => sum + record.totalAmount,
			0
		);

		const countStock = await prisma.product.aggregate({
			_sum: {
				stock: true,
			},
			where: {
				stock: { not: 0 },
			},
		});

		const totalProducts = countStock._sum.stock;

		const products = await prisma.product.findMany();

		const lowStockProducts = products.filter(
			(product) => product.stock < product.minStock
		);

		return res.status(200).json({
			todayRevenue,
			totalCustomer: todaySaleData.length,
			totalProducts,
			lowStockProducts: lowStockProducts.length,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.getLowProducts = async (req, res) => {
	try {
		const products = await prisma.product.findMany();

		let result = [];
		for (const product of products) {
			if (product.stock > product.minStock) {
				continue;
			}
			result.push(product);
		}

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
