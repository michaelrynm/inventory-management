const prisma = require("../prisma/client.js");

const generateProductId = async (productName) => {
  let prefix = productName.substring(0, 4).toUpperCase();

  while (prefix.length < 4) {
    prefix += "X";
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);

  const generatedId = `${prefix}${randomNum}`;

  const existingProduct = await prisma.product.findUnique({
    where: { id: generatedId },
  });

  if (existingProduct) {
    return generateProductId(productName);
  }

  return generatedId;
};

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
    const { name, brand, description, category, price, stock, minStock, unit } =
      req.body;

    // Generate a unique product ID
    const id = await generateProductId(name);

    const data = {
      id,
      name,
	  brand,
      description,
      category,
      price,
      stock,
      minStock,
      unit,
    };

    const newProduct = await prisma.product.create({
      data,
    });
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, category, price, stock, minStock, unit } =
      req.body;
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const data = { name, description, category, price, stock, minStock, unit };

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: data,
    });
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Error updating product", error });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const checkExist = await prisma.product.findUnique({
      where: { id },
    });

    if (!checkExist) {
      return res.status(404).json({ message: "Product not found" });
    }

    await prisma.product.delete({ where: { id } });

    return res.status(200).json({ message: "Successfully delete a product" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product", error });
  }
};
