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

  return rows.map((row) => ({
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
    variants: row.get("variant")
      ? [{ color: row.get("variant"), stock: parseInt(row.get("stock")) }]
      : [],
  }));
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
