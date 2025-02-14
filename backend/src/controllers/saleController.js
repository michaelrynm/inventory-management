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
    const { userId, customer, paymentMethod, date } = req.body;

    const newSale = await prisma.sale.create({
      data: {
        userId: parseInt(userId),
        customer,
        paymentMethod,
        date,
      },
    });
    return res.status(201).json(newSale);
  } catch (error) {
    return res.status(500).json({ messsage: "Error creating sale", error });
  }
};

exports.submitSale = async (req, res) => {
  try {
    const { saleId } = req.body;
    // Ambil semua detail penjualan berdasarkan saleId
    const saleDetails = await prisma.saleDetail.findMany({
      where: { saleId: saleId },
      select: { productId: true, quantity: true, totalPrice: true },
    });
    // Hitung totalAmount berdasarkan totalPrice dari setiap SaleDetail
    const totalAmount = saleDetails.reduce(
      (sum, sale) => sum + sale.totalPrice,
      0
    );
    // Kurangi stok produk berdasarkan jumlah yang dibeli
    for (const detail of saleDetails) {
      await prisma.product.update({
        where: { id: detail.productId },
        data: {
          stock: {
            decrement: detail.quantity, // Mengurangi stok produk
          },
        },
      });
    }
    // Perbarui totalAmount dalam tabel Sale
    const updatedSale = await prisma.sale.update({
      where: { id: saleId },
      data: { totalAmount: totalAmount },
    });
    return res.status(200).json(updatedSale);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error submitting sale", error });
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
      await prisma.saleDetail.deleteMany({
        where: {
          saleId: parseInt(id),
        },
      });
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
