const prisma = require("../prisma/client.js");

exports.getAll = async (req, res) => {
	try {
		const products = await prisma.product.findMany();

		return res.status(200).json(products);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.create = async (req, res) => {
	try {
		const { name, description, category, price, stock, minStock, unit } =
			req.body;

		const data = { name, description, category, price, stock, minStock, unit };

		const newProduct = await prisma.product.create({
			data,
		});
		return res.status(201).json(newProduct);
	} catch (error) {
		return res.status(500).json({ messsage: "Error creating product", error });
	}
};

exports.update = async (req, res) => {
	try {
		const { name, description, category, price, stock, minStock, unit } =
			req.body;

		const data = { name, description, category, price, stock, minStock, unit };

		const newProduct = await prisma.product.update({
			where: { id: parseInt(req.params.id) },
			data: data,
		});
		return res.status(200).json(newProduct);
	} catch (error) {
		return res.status(500).json({ messsage: "Error updating product", error });
	}
};

exports.delete = async (req, res) => {
	try {
		const { id } = req.params;
		const checkExist = await prisma.product.findUnique({
			where: { id: parseInt(id) },
		});

		if (!checkExist) {
			return res.status(404).json({ message: "Product not found" });
		}

		await prisma.product.delete({ where: { id: parseInt(id) } });

		return res.status(200).json({ message: "Successfully delete a product" });
	} catch (error) {
		return res.status(500).json({ messsage: "Error deleting product", error });
	}
};
