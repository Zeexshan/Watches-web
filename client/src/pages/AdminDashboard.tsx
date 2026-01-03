import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Package, ShoppingCart, DollarSign, Plus, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [variants, setVariants] = useState([{ color: "", stock: 0, image: "" }]);

  const isAdmin = user?.email === "zixshankhan@gmail.com";

  // Analytics Data preparation
  const { data: orders = [] } = useQuery<any[]>({
    queryKey: ["/api/orders"],
  });

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setUploadedUrl(data.url);
        toast({ title: "Image Uploaded", description: "Successfully uploaded product image." });
      }
    },
    onSettled: () => setIsUploading(false),
  });

  const salesData = orders.reduce((acc: any[], order) => {
    const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.sales += order.total;
    } else {
      acc.push({ date, sales: order.total });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const statusData = orders.reduce((acc: any[], order) => {
    const existing = acc.find(item => item.name === order.status);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: order.status, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#D4AF37', '#1E1E1E', '#3A3A3A', '#8E8E8E'];

  const addVariant = () => setVariants([...variants, { color: "", stock: 0, image: "" }]);
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleVariantImageUpload = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      setIsUploading(true);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        updateVariant(index, "image", data.url);
        toast({ title: "Variant Image Uploaded" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed" });
    } finally {
      setIsUploading(false);
    }
  };

  const addProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productData, adminEmail: user?.email }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product Added", description: "New luxury timepiece added to collection." });
      setIsAddModalOpen(false);
      setUploadedUrl("");
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      uploadMutation.mutate(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseInt(formData.get("price") as string),
      stock: variants.reduce((acc, v) => acc + (v.stock || 0), 0),
      category: formData.get("category"),
      image: uploadedUrl,
      variants: variants,
    };
    addProductMutation.mutate(data);
  };

  const totalSales = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);

  if (!isAdmin) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-black font-bold uppercase tracking-widest">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" required className="bg-background/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" required className="bg-background/50 border-white/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required className="bg-background/50 border-white/10 min-h-[100px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" name="price" type="number" required className="bg-background/50 border-white/10" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Product Variants</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addVariant} className="h-8 border-white/10">
                      <Plus className="h-3 w-3 mr-1" /> Add Variant
                    </Button>
                  </div>
                  {variants.map((v, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-sm space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                          <Label className="text-xs">Color/Name</Label>
                          <Input value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} placeholder="Gold" className="bg-background/50 border-white/10 h-8" />
                        </div>
                        <div className="w-24 space-y-2">
                          <Label className="text-xs">Stock</Label>
                          <Input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value))} className="bg-background/50 border-white/10 h-8" />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(i)} className="mt-6 h-8 w-8 text-red-400">
                          <Plus className="h-4 w-4 rotate-45" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label className="text-xs block mb-2">Variant Image</Label>
                          <div className="flex items-center gap-3">
                            <Button type="button" variant="outline" size="sm" className="h-8 border-white/10 relative overflow-hidden">
                              <Upload className="h-3 w-3 mr-2" /> Upload
                              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => e.target.files?.[0] && handleVariantImageUpload(i, e.target.files[0])} />
                            </Button>
                            {v.image && <img src={v.image} className="h-8 w-8 object-contain bg-black/20" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="border-white/10 w-full relative h-24 border-dashed" asChild>
                      <label className="cursor-pointer">
                        {isUploading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : uploadedUrl ? (
                          <img src={uploadedUrl} className="h-20 object-contain" />
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto h-6 w-6 mb-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Click to upload</span>
                          </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </label>
                    </Button>
                  </div>
                  {uploadedUrl && <p className="text-xs text-primary truncate">{uploadedUrl}</p>}
                </div>
                <Button type="submit" className="w-full bg-primary text-black font-bold uppercase" disabled={addProductMutation.isPending}>
                  {addProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card/30 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold">₹{totalSales.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/30 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/30 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Inventory</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold">{products.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card/30 border-white/10 p-6">
            <h3 className="text-lg font-serif font-bold mb-6 uppercase tracking-widest text-primary">Sales Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #ffffff10', borderRadius: '4px' }} itemStyle={{ color: '#D4AF37' }} />
                  <Line type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="bg-card/30 border-white/10 p-6">
            <h3 className="text-lg font-serif font-bold mb-6 uppercase tracking-widest text-primary">Order Status</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #ffffff10', borderRadius: '4px' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Management Tables */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6">Recent Orders</h2>
            <Card className="bg-card/30 border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-white/5">
                      <TableCell className="font-medium text-primary">{order.id}</TableCell>
                      <TableCell>{order.email}</TableCell>
                      <TableCell>₹{order.total.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-white/5 text-[10px] uppercase font-bold tracking-widest border border-white/10">
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-xs">Update Status</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-6">Product Inventory</h2>
            <Card className="bg-card/30 border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="border-white/5">
                      <TableCell className="text-muted-foreground">#{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{product.variants?.[0]?.stock || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
}