const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data
    await prisma.saleDetail.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.product.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.user.deleteMany();

    console.log("🗑️ Existing data cleared");

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@gmail.com",
        password: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      },
    });

    // Create cashier user
    const cashierUser = await prisma.user.create({
      data: {
        name: "Cashier",
        email: "kasir@gmail.com",
        password: await bcrypt.hash("kasir123", 10),
        role: "KASIR",
      },
    });

    console.log("👥 Users created");

    // Create sample products
    const products = await prisma.product.createMany({
      data: [
        {
          name: "Product 1",
          description: "Description for product 1",
          category: "Category A",
          price: 10000,
          stock: 100,
          minStock: 10,
          unit: "pcs",
        },
        {
          name: "Product 2",
          description: "Description for product 2",
          category: "Category B",
          price: 20000,
          stock: 50,
          minStock: 5,
          unit: "pcs",
        },
        {
          name: "Product 3",
          description: "Description for product 3",
          category: "Category A",
          price: 15000,
          stock: 75,
          minStock: 8,
          unit: "pcs",
        },
      ],
    });

    console.log("📦 Sample products created");

    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
