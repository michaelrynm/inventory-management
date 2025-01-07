const prisma = require("../prisma/client.js");

//to get all data for admin
exports.getAll = async (req, res) => {
	try {
		const sales = await prisma.sale.findMany();

		return res.status(200).json(sales);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

//get filtered sales data by user id
exports.getUserSale = async (req, res) => {
	try {
		const { userId } = req.body;
		const sales = await prisma.sale.findMany({
			where: { userId },
		});

		return res.status(200).json(sales);
	} catch (errosr) {
		return res.status(500).json({ error: error.message });
	}
};

//create a new sale data before adding sale details data
exports.create = async (req, res) => {
	try {
		const { userId, customer, paymentMethod } = req.body;

		const newSale = await prisma.sale.create({
			data: {
				userId,
				customer,
				paymentMethod,
			},
		});
		return res.status(201).json(newSale);
	} catch (error) {
		return res.status(500).json({ messsage: "Error creating sale", error });
	}
};

//updating sale totalAmount to pay after input all saleDetails data
exports.submitSale = async (req, res) => {
	try {
		const { saleId } = req.body;

		const getSaleDetails = await prisma.saleDetail.findMany({
			where: { saleId: saleId },
			select: { totalPrice: true },
		});

		const totalAmount = getSaleDetails.reduce(
			(sum, sale) => sum + sale.totalPrice,
			0
		);

		const newSale = await prisma.sale.update({
			where: { id: saleId },
			data: { totalAmount: totalAmount },
		});
		return res.status(200).json(newSale);
	} catch (error) {
		return res.status(500).json({ messsage: "Error submitting sale", error });
	}
};
