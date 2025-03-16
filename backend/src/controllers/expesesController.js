const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createExpense = async (req, res) => {
  try {
    const {
      name,
      description,
      supplier,
      amount,
      unit,
      price,
      totalPrice,
      date,
    } = req.body;
    const userId = req.body.userId;

    const expense = await prisma.expense.create({
      data: {
        name,
        description,
        supplier,
        amount: parseInt(amount),
        unit,
        price: parseFloat(price),
        totalPrice: parseFloat(totalPrice),
        date: new Date(date),
        userId,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating expense" });
  }
};


exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      supplier,
      amount,
      unit,
      price,
      totalPrice,
      date,
      userId,
    } = req.body;

    // Pastikan ID dikonversi ke angka
    const expenseId = parseInt(id);

    // Cek apakah expense dengan ID tersebut ada
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!existingExpense) {
      return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
    }

    // Update expense
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        name,
        description,
        supplier,
        amount: parseInt(amount),
        unit,
        price: parseFloat(price),
        totalPrice: parseFloat(totalPrice),
        date: new Date(date),
        userId,
      },
    });

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Error updating expense" });
  }
};


exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting expense" });
  }
};
