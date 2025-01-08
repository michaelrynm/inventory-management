const prisma = require("../prisma/client.js");

//to get all data for admin
exports.getAll = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json(sales);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get filtered sales data by user id
exports.getUserSale = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const sales = await prisma.sale.findMany({
      where: {
        userId: parseInt(id),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (sales.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json(sales);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//create a new sale data before adding sale details data
exports.create = async (req, res) => {
  try {
    const { userId, customer, paymentMethod } = req.body;

    const newSale = await prisma.sale.create({
      data: {
        userId: parseInt(userId),
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

exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const checkExist = await prisma.sale.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (checkExist) {
      await prisma.sale.delete({
        where: {
          id: parseInt(id),
        },
      });
      return res
        .status(200)
        .json({ message: "Successfully delete a sale data" });
    } else {
      return res.status(404).json({ message: "sale data not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error deleting sale data", error });
  }
};
