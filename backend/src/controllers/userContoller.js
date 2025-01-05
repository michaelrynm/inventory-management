const prisma = require("../prisma/client.js");
const bcrypt = require("bcryptjs");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // Tidak menyertakan password
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.messsage });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ messsage: "Error creating user", error });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // Tidak menyertakan password
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ messsage: "Error getting user", error });
  }
};
