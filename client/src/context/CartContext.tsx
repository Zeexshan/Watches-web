import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends Product {
  quantity: number;
  selectedVariant: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: string) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, variant: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.selectedVariant === variant);
      if (existing) {
        toast({ title: "Cart Updated", description: "Item quantity increased." });
        return prev.map((item) =>
          item.id === product.id && item.selectedVariant === variant
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast({ title: "Added to Cart", description: `${product.name} added.` });
      return [...prev, { ...product, quantity: 1, selectedVariant: variant }];
    });
  };

  const removeItem = (itemId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    toast({ title: "Removed from Cart" });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
