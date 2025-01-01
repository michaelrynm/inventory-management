// Data master untuk membuat variasi
const products = [
  { id: "P001", name: "Beras", price: 15000 },
  { id: "P002", name: "Sabun", price: 5000 },
  { id: "P003", name: "Sampo", price: 15000 },
  { id: "P004", name: "Pasta Gigi", price: 12000 },
  { id: "P005", name: "Tissue", price: 8000 },
  { id: "P006", name: "Detergen", price: 20000 },
  { id: "P007", name: "Minyak Goreng", price: 45000 },
  { id: "P008", name: "Gula Pasir", price: 16000 },
  { id: "P009", name: "Kopi", price: 5000 },
  { id: "P010", name: "Teh Celup", price: 7000 },
];

const customerNames = [
  "Budi Santoso",
  "Ani Kusuma",
  "Dedi Wijaya",
  "Siti Rahayu",
  "Ahmad Fauzi",
  "Maya Putri",
  "Rudi Hermawan",
  "Nina Sari",
  "Eko Prasetyo",
  "Dewi Lestari",
  "Rizki Pratama",
  "Linda Wati",
  "Hendra Susanto",
  "Rina Fitriani",
  "Agus Setiawan",
  "Nita Indah",
  "Yudi Pranoto",
  "Sri Wahyuni",
  "Joko Susilo",
  "Tri Handayani",
];

const cashierNames = ["Sarah Wijaya"];

const paymentMethods = ["cash", "debit", "kredit", "qris"];

// Function untuk generate transaksi
function generateTransactions(count) {
  const transactions = [];
  let currentDate = new Date("2024-12-29");

  for (let i = 0; i < count; i++) {
    // Generate random values
    const customerName =
      customerNames[Math.floor(Math.random() * customerNames.length)];
    const cashierName =
      cashierNames[Math.floor(Math.random() * cashierNames.length)];
    const paymentMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const discountPercentage = [0, 5, 10, 15][Math.floor(Math.random() * 4)];

    // Generate items (1-5 items per transaction)
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let subtotal = 0;

    // Generate random items
    const availableProducts = [...products];
    for (let j = 0; j < itemCount; j++) {
      const productIndex = Math.floor(Math.random() * availableProducts.length);
      const product = availableProducts[productIndex];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const total_price = product.price * quantity;

      items.push({
        id: product.id,
        product_name: product.name,
        quantity: quantity,
        price_per_unit: product.price,
        total_price: total_price,
      });

      subtotal += total_price;
      availableProducts.splice(productIndex, 1);
    }

    // Calculate totals
    const discount_amount = Math.round(subtotal * (discountPercentage / 100));
    const total = subtotal - discount_amount;

    // Generate transaction date (going backwards from current date)
    const transactionDate = new Date(currentDate);
    transactionDate.setDate(currentDate.getDate() - Math.floor(i / 10)); // Change date every 10 transactions

    transactions.push({
      nota: `TRX-${271428919 + i}`,
      customer_name: customerName,
      cashier_name: cashierName,
      date: transactionDate.toISOString().split("T")[0],
      payment_method: paymentMethod,
      discount_percentage: discountPercentage,
      items: items,
      subtotal: subtotal,
      discount_amount: discount_amount,
      total: total,
    });
  }

  return transactions;
}

// Generate 100 transactions
const dummyTransactions = generateTransactions(100);

export default dummyTransactions;
