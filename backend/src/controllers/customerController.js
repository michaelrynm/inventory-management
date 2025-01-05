const prisma = require("../prisma/client.js");

exports.getAll = async (req, res) => {
	try {
		const customers = await prisma.customer.findMany();

		return res.status(200).json(customers);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.getDetail = async (req, res) => {
	try {
		const customer = await prisma.customer.findUnique({
			where: { id: parseInt(req.params.id) },
		});

		return res.status(200).json(customer);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.create = async (req, res) => {
	try {
		const { name, contact, email, address } = req.body;

		const data = { name, contact, email, address };

		const newCustomer = await prisma.customer.create({
			data,
		});
		return res.status(201).json(newCustomer);
	} catch (error) {
		return res.status(500).json({ messsage: "Error creating customer", error });
	}
};

exports.update = async (req, res) => {
	try {
		const { name, contact, email, address } = req.body;

		const data = { name, contact, email, address };

		const newCustomer = await prisma.customer.update({
			where: { id: parseInt(req.params.id) },
			data: data,
		});
		return res.status(200).json(newCustomer);
	} catch (error) {
		return res.status(500).json({ messsage: "Error updating customer", error });
	}
};

exports.delete = async (req, res) => {
	try {
		const { id } = req.params;
		const checkExist = await prisma.customer.findUnique({
			where: { id: parseInt(id) },
		});

		if (!checkExist) {
			return res.status(404).json({ message: "customer not found" });
		}

		await prisma.customer.delete({ where: { id: parseInt(id) } });

		return res.status(200).json({ message: "Successfully delete a customer" });
	} catch (error) {
		return res.status(500).json({ messsage: "Error deleting customer", error });
	}
};
