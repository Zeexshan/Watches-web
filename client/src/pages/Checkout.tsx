import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const SHIPPING_COST = 100;

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">("prepaid");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name.split(' ')[0] || "",
        lastName: user.name.split(' ').slice(1).join(' ') || "",
        email: user.email,
      }));
    }
  }, [user]);

  const checkoutMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Order Placed Successfully!" });
      clearCart();
      setLocation("/order-success");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: error.message,
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast({ title: "Login Required", description: "Please login to complete your order." });
      setLocation("/account?from=checkout");
      return;
    }
    if (!formData.address || !formData.pincode) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all required fields." });
      return;
    }
    setStep("payment");
    window.scrollTo(0, 0);
  };

  const handleOrderPlace = () => {
    const productAmountDue = paymentMethod === 'cod' ? cartTotal : 0;
    
    checkoutMutation.mutate({
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.pincode}`,
      total: cartTotal + (paymentMethod === 'cod' ? SHIPPING_COST : 0),
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        variant: item.selectedVariant,
        quantity: item.quantity,
        price: item.price
      })),
      paymentMethod,
      shipping_fee_paid: "TRUE",
      product_amount_due: productAmountDue
    });
  };

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const amountToPayNow = paymentMethod === "cod" ? SHIPPING_COST : cartTotal;
  const amountOnDelivery = paymentMethod === "cod" ? cartTotal : 0;
  const isLoading = checkoutMutation.isPending;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Checkout Process */}
          <div className="lg:col-span-7 space-y-8">
            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step === "shipping" ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step === "shipping" ? "border-primary bg-primary/10" : "border-white/10"}`}>1</div>
                <span className="font-serif uppercase tracking-widest text-sm">Shipping</span>
              </div>
              <div className="w-12 h-[1px] bg-white/10"></div>
              <div className={`flex items-center gap-2 ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step === "payment" ? "border-primary bg-primary/10" : "border-white/10"}`}>2</div>
                <span className="font-serif uppercase tracking-widest text-sm">Payment</span>
              </div>
            </div>

            {step === "shipping" ? (
              <form onSubmit={handleShippingSubmit} className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <h2 className="text-2xl font-serif mb-6">Shipping Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="bg-card/20 border-white/10 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="bg-card/20 border-white/10 h-12" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="bg-card/20 border-white/10 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} className="bg-card/20 border-white/10 h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} className="bg-card/20 border-white/10 h-12" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} className="bg-card/20 border-white/10 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" name="pincode" required value={formData.pincode} onChange={handleInputChange} className="bg-card/20 border-white/10 h-12" />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full h-14 uppercase tracking-widest font-serif font-bold mt-8">
                  Continue to Payment
                </Button>
              </form>
            ) : (
              <div className="animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-serif mb-6">Payment Method</h2>
                
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "prepaid" | "cod")} className="space-y-4">
                  <div className={`border rounded-lg p-6 transition-colors cursor-pointer ${paymentMethod === "prepaid" ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/30"}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="prepaid" id="prepaid" />
                      <Label htmlFor="prepaid" className="flex-grow cursor-pointer">
                        <span className="block font-bold text-lg">Prepaid (Razorpay)</span>
                        <span className="text-sm text-muted-foreground">Pay securely with Credit/Debit Card, UPI, or Netbanking.</span>
                      </Label>
                      <span className="font-bold text-green-400">No Extra Fee</span>
                    </div>
                  </div>

                  <div className={`border rounded-lg p-6 transition-colors cursor-pointer ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/30"}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-grow cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="block font-bold text-lg">Partial COD</span>
                          <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Popular</span>
                        </div>
                        <span className="text-sm text-muted-foreground block mt-1">
                          Pay shipping charge (₹{SHIPPING_COST}) now to confirm order.
                        </span>
                        <span className="text-sm text-primary font-medium block mt-1">
                          Pay remaining ₹{cartTotal.toLocaleString()} on delivery.
                        </span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                <div className="mt-8 bg-card/30 p-6 rounded-lg border border-white/5">
                  <h3 className="font-serif font-bold mb-4 text-lg">Payment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Cart Value</span>
                      <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping Charge</span>
                      <span>₹{paymentMethod === 'cod' ? SHIPPING_COST : 0} (Included/Waived)</span>
                    </div>
                    <Separator className="bg-white/10 my-2" />
                    <div className="flex justify-between font-bold text-lg text-white">
                      <span>Amount to Pay Now</span>
                      <span className="text-primary">₹{amountToPayNow.toLocaleString('en-IN')}</span>
                    </div>
                    {paymentMethod === 'cod' && (
                       <div className="flex justify-between font-bold text-base text-muted-foreground mt-2">
                        <span>Balance on Delivery</span>
                        <span>₹{amountOnDelivery.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button variant="outline" className="w-1/3 h-14 border-white/10" onClick={() => setStep("shipping")}>
                    Back
                  </Button>
                  <Button 
                    className="w-2/3 h-14 uppercase tracking-widest font-serif font-bold bg-primary text-black hover:bg-primary/90"
                    onClick={handleOrderPlace}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      `Pay ₹${amountToPayNow.toLocaleString('en-IN')} & Place Order`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary (Visible on Desktop) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-card/30 p-8 border border-white/5 sticky top-24">
              <h3 className="font-serif font-bold text-xl mb-6">In Your Bag</h3>
              <div className="space-y-6 max-h-[500px] overflow-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedVariant}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-card/50 flex-shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.selectedVariant} x {item.quantity}</p>
                      <p className="text-sm font-bold mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="bg-white/10 my-6" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
