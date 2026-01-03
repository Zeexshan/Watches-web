import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
  const { toast } = useToast();

  const checkoutMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: "Your order has been recorded in our system.",
      });
      clearCart();
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-serif mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't made your choice yet.</p>
          <Link href="/shop">
            <Button size="lg" className="uppercase tracking-widest font-serif">Continue Shopping</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <h1 className="text-4xl font-serif font-bold text-white mb-12 text-center">Your Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-white/10 text-sm uppercase tracking-widest text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div key={`${item.id}-${item.selectedVariant}`} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-white/5 pb-8">
                <div className="md:col-span-6 flex gap-6">
                  <div className="w-24 h-32 bg-card/30 flex-shrink-0 flex items-center justify-center p-2">
                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-primary uppercase tracking-widest">{item.brand}</span>
                    <h3 className="font-serif text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Variant: {item.selectedVariant}</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mt-2"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 text-center hidden md:block">
                  ₹{item.price.toLocaleString('en-IN')}
                </div>

                <div className="md:col-span-2 flex justify-center">
                  <div className="flex items-center border border-white/20">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-white/10"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-white/10"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 text-right font-bold">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card/30 p-8 border border-white/5 sticky top-24">
              <h2 className="text-2xl font-serif mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Estimate</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (GST included)</span>
                  <span>₹0.00</span>
                </div>
              </div>

              <Separator className="bg-white/10 mb-6" />

              <div className="flex justify-between text-lg font-bold mb-8">
                <span>Total</span>
                <span className="text-primary">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-primary text-black hover:bg-primary/90 py-6 uppercase tracking-widest font-serif font-bold">
                  Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>

              <div className="mt-6 text-xs text-center text-muted-foreground">
                <p>Secure Checkout - SSL Encrypted</p>
                <div className="flex justify-center gap-2 mt-2 opacity-50">
                  <span>VISA</span>
                  <span>Mastercard</span>
                  <span>UPI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
