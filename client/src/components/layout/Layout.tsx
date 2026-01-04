import { Link } from "wouter";
import { ShoppingBag, User, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { items } = useCart();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-card border-r border-white/10 text-foreground">
                <nav className="flex flex-col gap-6 mt-10">
                  <Link href="/" className="text-2xl font-serif text-primary hover:text-primary/80 transition-colors">
                    Home
                  </Link>
                  <Link href="/shop" className="text-xl font-medium hover:text-primary transition-colors">
                    Choicefull Accessories
                  </Link>
                  <Link href="/categories" className="text-xl font-medium hover:text-primary transition-colors">
                    Categories
                  </Link>
                  <Link href="/account" className="text-xl font-medium hover:text-primary transition-colors">
                    My Account
                  </Link>
                  <Link href="/contact" className="text-xl font-medium hover:text-primary transition-colors">
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-serif tracking-widest font-bold text-foreground">
            CIRCLE<span className="text-primary">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm uppercase tracking-widest hover:text-primary transition-colors duration-300">
              Home
            </Link>
            <Link href="/shop" className="text-sm uppercase tracking-widest hover:text-primary transition-colors duration-300">
              Choicefull Accessories
            </Link>
            <Link href="/shop" className="text-sm uppercase tracking-widest hover:text-primary transition-colors duration-300">
              Categories
            </Link>
            <Link href="/contact" className="text-sm uppercase tracking-widest hover:text-primary transition-colors duration-300">
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64' : 'w-8'}`}>
              {isSearchOpen ? (
                <div className="relative w-full">
                  <Input 
                    placeholder="Search..." 
                    className="h-8 bg-transparent border-b border-primary/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <X 
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary"
                    onClick={() => setIsSearchOpen(false)} 
                  />
                </div>
              ) : (
                <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-transparent" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            <Link href="/account">
              <Button variant="ghost" size="icon" className="hidden md:flex hover:text-primary hover:bg-transparent">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-transparent relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card pt-16 pb-8 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold tracking-widest">CIRCLE<span className="text-primary">.</span></h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Curating the finest luxury timepieces and accessories for the discerning individual. Elegance in every detail.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-serif text-primary">Collections</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/shop?category=Watches" className="hover:text-primary transition-colors">Luxury Watches</Link></li>
                <li><Link href="/shop?category=Belts" className="hover:text-primary transition-colors">Leather Belts</Link></li>
                <li><Link href="/shop?category=Sunglasses" className="hover:text-primary transition-colors">Sunglasses</Link></li>
                <li><Link href="/shop?category=Attar" className="hover:text-primary transition-colors">Exquisite Attar</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-serif text-primary">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/account" className="hover:text-primary transition-colors">My Account</Link></li>
                <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/care" className="hover:text-primary transition-colors">Watch Care</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-serif text-primary">Newsletter</h4>
              <p className="text-sm text-muted-foreground">Subscribe for exclusive offers and new arrivals.</p>
              <div className="flex gap-2">
                <Input placeholder="Your email" className="bg-background/50 border-white/10 focus-visible:ring-primary" />
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Join</Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Circle Luxury. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
