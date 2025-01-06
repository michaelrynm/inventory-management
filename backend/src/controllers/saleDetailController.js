const prisma = require("../prisma/client.js");

//to add product after create sale data
exports.addProduct = async (req, res) => {
	try {
		const { saleId, productId, quantity } = req.body;

		const productData = await prisma.product.findUnique({
			where: { id: productId },
			select: { id: true, name: true, price: true },
		});

		const totalPrice = productData.price * quantity;

		await prisma.saleDetail.create({
			data: {
				saleId: saleId,
				productId: productId,
				quantity: quantity,
				totalPrice: totalPrice,
			},
		});
		return res.status(201).json({ ...productData, quantity, totalPrice });
	} catch (error) {
		return res.status(500).json({ messsage: "Error adding product", error });
	}
};

//to delete product before submitting final sale price
exports.deleteSaleDetail = async (req, res) => {
	try {
		const { id } = req.params;
		const checkExist = await prisma.saleDetail.findUnique({
			where: { id: parseInt(id) },
		});

		if (!checkExist) {
			return res.status(404).json({ message: "sale data not found" });
		}

		await prisma.saleDetail.delete({ where: { id: parseInt(id) } });

		return res.status(200).json({ message: "Successfully delete a sale data" });
	} catch (error) {
		return res
			.status(500)
			.json({ messsage: "Error deleting sale data", error });
	}
};

//to get add products before submitting saleDetail
exports.getSaleDetail = async (req, res) => {
	try {
		const { saleId } = req.params;

		const saleDetails = await prisma.saleDetail.findMany({
			where: { saleId: parseInt(saleId) },
			include: { product: 1 },
		});

		let result = [];
		for (const saleDetail of saleDetails) {
			const data = {
				productId: saleDetail.product.id,
				name: saleDetail.product.name,
				quantity: saleDetail.quantity,
				price: saleDetail.product.price,
				totalPrice: saleDetail.totalPrice,
			};

			result.push(data);
		}

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
