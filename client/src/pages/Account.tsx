import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, MapPin, LogOut, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export default function Account() {
  const { user, isLoggedIn, login, logout, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      
      const data = await response.json();
      if (data.success) {
        login(data.user);
        toast({ title: "Welcome back!", description: `Hello ${data.user.name}` });
        
        const searchParams = new URLSearchParams(window.location.search);
        const from = searchParams.get("from");
        if (from === "checkout") {
          setLocation("/checkout");
        }
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (document.getElementById('reg-name') as HTMLInputElement).value;
    const email = (document.getElementById('reg-email') as HTMLInputElement).value;
    const password = (document.getElementById('reg-password') as HTMLInputElement).value;

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username: email, password }),
      });
      
      const data = await response.json();
      if (data.success) {
        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });
        const loginData = await loginRes.json();
        if (loginData.success) {
          login(loginData.user);
          toast({ title: "Account Created", description: "Welcome to Circle Luxury" });
          
          const searchParams = new URLSearchParams(window.location.search);
          const from = searchParams.get("from");
          if (from === "checkout") {
            setLocation("/checkout");
          }
        }
      } else {
        toast({ variant: "destructive", title: "Registration Failed" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      setOrdersLoading(true);
      fetch(`/api/orders?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setOrders(Array.isArray(data) ? data : []);
        })
        .catch(err => console.error("Error fetching orders:", err))
        .finally(() => setOrdersLoading(false));
    }
  }, [isLoggedIn, user?.email]);

  if (isLoading) return null;

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 flex justify-center">
          <Card className="w-full max-w-md bg-card/30 border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-3xl">Welcome to Circle</CardTitle>
              <CardDescription>Sign in to access your exclusive benefits.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-background/50">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="bg-background/50 border-white/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" className="bg-background/50 border-white/10" required />
                    </div>
                    <Button type="submit" className="w-full uppercase tracking-widest font-serif font-bold bg-primary text-black hover:bg-primary/90">
                      Sign In
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form className="space-y-4 mt-4" onSubmit={handleRegister}>
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input id="reg-name" placeholder="John Doe" className="bg-background/50 border-white/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" type="email" placeholder="john@example.com" className="bg-background/50 border-white/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" type="password" className="bg-background/50 border-white/10" required />
                    </div>
                    <Button type="submit" variant="outline" className="w-full uppercase tracking-widest font-serif font-bold border-white/20 hover:bg-white/10 text-white">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-2">
            <Card className="bg-card/30 border-white/10 p-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black font-bold text-xl">
                  {user?.name?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="font-serif font-bold">{user?.name}</h3>
                  <p className="text-xs text-muted-foreground">Member</p>
                </div>
              </div>
              <nav className="space-y-1">
                <Tabs defaultValue="orders" className="w-full border-none">
                  <TabsList className="flex flex-col h-auto w-full bg-transparent gap-1 p-0">
                    <TabsTrigger value="profile" className="w-full justify-start px-3 py-2 data-[state=active]:bg-white/5 data-[state=active]:text-primary hover:bg-white/5 bg-transparent">
                      <UserIcon className="mr-2 h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="w-full justify-start px-3 py-2 data-[state=active]:bg-white/5 data-[state=active]:text-primary hover:bg-white/5 bg-transparent">
                      <Package className="mr-2 h-4 w-4" /> Orders
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="w-full justify-start px-3 py-2 data-[state=active]:bg-white/5 data-[state=active]:text-primary hover:bg-white/5 bg-transparent">
                      <MapPin className="mr-2 h-4 w-4" /> Addresses
                    </TabsTrigger>
                  </TabsList>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-8"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                </Tabs>
              </nav>
            </Card>
            {user?.email === "zixshankhan@gmail.com" && (
              <Button 
                variant="outline" 
                className="w-full border-primary/20 hover:bg-primary/10 text-primary"
                onClick={() => setLocation("/admin")}
              >
                Admin Dashboard
              </Button>
            )}
          </aside>

          <div className="flex-1">
            <Tabs defaultValue="orders" className="w-full">
              <TabsContent value="profile" className="mt-0">
                <Card className="bg-card/30 border-white/10">
                  <CardHeader>
                    <CardTitle className="font-serif">Profile Information</CardTitle>
                    <CardDescription>Update your personal account details.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6" onSubmit={(e) => {
                      e.preventDefault();
                      toast({ title: "Profile Updated", description: "Your changes have been saved." });
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={user?.name} className="bg-background/50 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" defaultValue={user?.email} disabled className="bg-background/20 border-white/5 cursor-not-allowed opacity-50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="+91 98765 43210" className="bg-background/50 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label>Membership Tier</Label>
                          <div className="h-10 px-3 flex items-center bg-primary/10 border border-primary/20 text-primary rounded-md font-serif italic">
                            Verified Circle Member
                          </div>
                        </div>
                      </div>
                      <Button type="submit" className="bg-primary text-black hover:bg-primary/90">
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>
                <div className="space-y-6">
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="h-32 bg-card/20 animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">Start your collection today.</p>
                      <Button variant="link" className="text-primary" onClick={() => setLocation("/shop")}>Shop Now</Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="bg-card/30 border-white/10">
                          <CardHeader className="flex flex-row items-center justify-between gap-4 py-4">
                            <div>
                              <CardTitle className="text-sm font-medium">Order #{order.id}</CardTitle>
                              <CardDescription>{new Date(order.date).toLocaleDateString()}</CardDescription>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">₹{order.total.toLocaleString('en-IN')}</p>
                              <p className="text-xs uppercase tracking-wider text-muted-foreground">{order.status}</p>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="addresses" className="mt-0">
                <Card className="bg-card/30 border-white/10">
                  <CardHeader>
                    <CardTitle className="font-serif">Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery locations.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                      <p className="text-muted-foreground">No saved addresses found.</p>
                      <Button variant="outline" className="mt-4 border-white/10">Add New Address</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
