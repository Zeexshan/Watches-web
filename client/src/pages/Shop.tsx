import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/product/ProductCard";
import { Product, CATEGORIES } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") || "All";

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Sync with URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && priceMatch;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0; // featured/default
  });

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-serif mb-4">Categories</h3>
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${selectedCategory === "All" ? "text-primary font-bold" : "text-muted-foreground"}`}
            onClick={() => setSelectedCategory("All")}
          >
            All Collections
          </Button>
          {CATEGORIES.map(cat => (
            <Button 
              key={cat}
              variant="ghost" 
              className={`w-full justify-start ${selectedCategory === cat ? "text-primary font-bold" : "text-muted-foreground"}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-serif mb-4">Price Range</h3>
        <Slider 
          defaultValue={[0, 5000000]} 
          max={5000000} 
          step={1000} 
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          className="mb-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-card/30 py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold text-white mb-2">The Collection</h1>
          <p className="text-muted-foreground">Discover our exclusive range of luxury items.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile Filters */}
          <div className="md:hidden flex justify-between items-center mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-white/10">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-card border-r border-white/10">
                <div className="mt-8">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
            
            <span className="text-sm text-muted-foreground">{filteredProducts.length} Products</span>
          </div>

          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8">
              <span className="hidden md:block text-sm text-muted-foreground">
                Showing {filteredProducts.length} results
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-background border-white/10">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border border-dashed border-white/10 rounded-lg">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
                <Button 
                  variant="link" 
                  className="text-primary mt-2"
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceRange([0, 5000000]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
