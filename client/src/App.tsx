import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Account from "@/pages/Account";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-serif font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">This page is under construction. Please check back later.</p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/categories" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-success" component={OrderSuccess} />
      <Route path="/account" component={Account} />
      <Route path="/register" component={Account} />
      
      {/* Footer Links */}
      <Route path="/contact" component={() => <PlaceholderPage title="Contact Us" />} />
      <Route path="/faq" component={() => <PlaceholderPage title="FAQ" />} />
      <Route path="/shipping" component={() => <PlaceholderPage title="Shipping Policy" />} />
      <Route path="/returns" component={() => <PlaceholderPage title="Returns & Exchanges" />} />
      <Route path="/privacy" component={() => <PlaceholderPage title="Privacy Policy" />} />
      <Route path="/terms" component={() => <PlaceholderPage title="Terms of Service" />} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
