const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createExpense = async (req, res) => {
  try {
    const { name, description, supplier, amount, unit, price, date } = req.body;
    const userId = req.body.userId; // Assuming you have authentication middleware

    const expense = await prisma.expense.create({
      data: {
        name,
        description,
        supplier,
        amount: parseInt(amount),
        unit,
        price: parseFloat(price),
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
