import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

const jwt = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

export const doc = new GoogleSpreadsheet(
  process.env.GOOGLE_SHEET_ID || "",
  jwt,
);

export async function initSheets() {
  await doc.loadInfo();
}

export async function getProducts() {
  await initSheets();
  const sheet = doc.sheetsByTitle["Products"];
  const rows = await sheet.getRows();

  return rows.map((row) => {
    let variants = [];
    try {
      const variantData = row.get("variants") || row.get("variant");
      if (variantData) {
        // Try to parse as JSON first (Task 2)
        if (variantData.startsWith('[') || variantData.startsWith('{')) {
          variants = JSON.parse(variantData);
        } else {
          // Fallback to old simple variant structure
          variants = [{ color: variantData, stock: parseInt(row.get("stock") || "0"), image: row.get("image_url") }];
        }
      }
    } catch (e) {
      console.error("Error parsing variants for product", row.get("id"), e);
      variants = [];
    }

    return {
      id: parseInt(row.get("id")),
      name: row.get("name"),
      brand: "Luxury",
      price: parseInt(row.get("price")),
      category: row.get("category"),
      description: row.get("description"),
      image: row.get("image_url") || "/attached_assets/watch1.png",
      images: row.get("image_url") ? [row.get("image_url")] : [],
      isBestSeller: row.get("is_featured") === "TRUE",
      isNew: false,
      variants: variants,
    };
  });
}

// --- NEW: Add User Function ---
export async function addUser(user: any) {
  await initSheets();
  const sheet = doc.sheetsByTitle["Users"];
  await sheet.addRow({
    user_id: `USR-${Date.now()}`,
    name: user.name || "Guest",
    email: user.username, // Using username as email for login
    password_hash: user.password, // In real app, hash this!
    phone: "",
    saved_address: "",
  });
  return { id: 1, username: user.username };
}

// --- NEW: Get Orders Function ---
export async function getOrders(email?: string) {
  await initSheets();
  const sheet = doc.sheetsByTitle["Orders"];
  const rows = await sheet.getRows();

  const orders = rows.map((row) => ({
    id: row.get("order_id"),
    email: row.get("user_email"),
    address: row.get("shipping_address"),
    pincode: row.get("pincode"),
    items: JSON.parse(row.get("items") || "[]"),
    paymentMethod: row.get("payment_method"),
    total: parseInt(row.get("product_amount_due") || "0"),
    status: row.get("status") || "Processing",
    date: row.get("date"),
  }));

  if (email) {
    return orders.filter((o) => o.email === email);
  }
  return orders;
}

// --- NEW: Add Product Function ---
export async function addProduct(product: any) {
  await initSheets();
  const sheet = doc.sheetsByTitle["Products"];
  
  // Get next ID
  const rows = await sheet.getRows();
  const nextId = rows.length > 0 ? Math.max(...rows.map(r => parseInt(r.get("id") || "0"))) + 1 : 1;

  await sheet.addRow({
    id: nextId,
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description,
    image_url: product.image,
    stock: product.stock,
    variants: JSON.stringify(product.variants || []),
    is_featured: "FALSE",
  });
  return { id: nextId, ...product };
}

// --- NEW: Update Order Status Function ---
export async function updateOrderStatus(orderId: string, newStatus: string) {
  await initSheets();
  const sheet = doc.sheetsByTitle["Orders"];
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get("order_id") === orderId);
  if (row) {
    row.set("status", newStatus);
    await row.save();
    return true;
  }
  return false;
}

// --- NEW: Delete Product Function ---
export async function deleteProduct(productId: number) {
  await initSheets();
  const sheet = doc.sheetsByTitle["Products"];
  const rows = await sheet.getRows();
  const row = rows.find(r => parseInt(r.get("id")) === productId);
  if (row) {
    await row.delete();
    return true;
  }
  throw new Error("Product not found");
}

// ... keep existing imports and functions ...

// --- NEW: Real Login Function ---
export async function loginUser(credentials: any) {
  await initSheets();
  const sheet = doc.sheetsByTitle["Users"];
  const rows = await sheet.getRows();

  // Find user by email
  const user = rows.find((row) => row.get("email") === credentials.username);

  if (!user) return null; // User not found

  // In a real app, we check hashed password. For now, check plain text match.
  if (user.get("password_hash") === credentials.password) {
    return {
      id: user.get("user_id"),
      name: user.get("name"),
      email: user.get("email"),
    };
  }
  return null; // Wrong password
}
// --- NEW: Add Order Function ---
export async function addOrder(order: any) {
  await initSheets();
  const sheet = doc.sheetsByTitle["Orders"];
  await sheet.addRow({
    order_id: `ORD-${Date.now()}`,
    user_email: order.email || "Guest",
    shipping_address: `${order.address}, ${order.city} - ${order.pincode}`,
    pincode: order.pincode,
    items: JSON.stringify(order.items),
    payment_method: "COD",
    shipping_fee_paid: "TRUE",
    product_amount_due: order.total,
    date: new Date().toISOString(),
  });
}
