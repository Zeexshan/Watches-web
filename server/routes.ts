import type { Express } from "express";
import { createServer, type Server } from "http";
import { getProducts, addOrder, addUser, loginUser } from "./db";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    try {
      const products = await getProducts();
      res.json(products);
    } catch (error) {
      console.error("Fetch Error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const order = {
        ...req.body,
        payment_method: req.body.paymentMethod === 'cod' ? 'COD' : 'PREPAID',
        shipping_fee_paid: req.body.shipping_fee_paid || 'TRUE',
        product_amount_due: req.body.product_amount_due || 0,
      };
      await addOrder(order);
      res.json({ success: true });
    } catch (error) {
      console.error("Order Error:", error);
      res.status(500).json({ message: "Failed to save order" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      await addUser(req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Failed to register" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const user = await loginUser(req.body);
      if (user) {
        res.json({ success: true, user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
