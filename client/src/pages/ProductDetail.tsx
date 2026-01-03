import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, RefreshCw, Star, ShoppingBag, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const product = products.find(p => p.id === productId);
  
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]);
  const [selectedImage, setSelectedImage] = useState(product?.image);

  // Variant to Image mapping Logic
  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant);
    
    // Check for variant specific images from the new structure
    if (variant.image) {
      setSelectedImage(variant.image);
    } else {
      // Fallback to existing manual mapping for legacy data
      const colorImages: Record<string, string> = {
        "Gold": "/attached_assets/watch1.png",
        "Black": "/attached_assets/watch2.png",
        "Silver": "/attached_assets/watch3.png",
        "Rose Gold": "/attached_assets/watch4.png"
      };

      if (colorImages[variant.color]) {
        setSelectedImage(colorImages[variant.color]);
      } else {
        setSelectedImage(product.image);
      }
    }
  };

  const { toast } = useToast();
  const { addItem } = useCart();

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-4xl font-serif mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button>Return to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addItem(product, selectedVariant?.color || "Default");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-card/30 flex items-center justify-center p-8 overflow-hidden relative group">
              <img 
                src={selectedImage || product.image} 
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            {product.images?.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    className={`aspect-square bg-card/30 p-2 border ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-white/20'} transition-all`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <span className="text-primary uppercase tracking-widest text-sm font-bold mb-2 block">{product.brand}</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white font-light">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-green-500 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-green-500" /> In Stock
                </span>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="space-y-4">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">Select Variant</span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant: any, idx: number) => (
                    <button
                      key={idx}
                      disabled={variant.stock === 0}
                      onClick={() => handleVariantChange(variant)}
                      className={`px-6 py-3 border text-sm uppercase tracking-wider transition-all relative
                        ${selectedVariant?.color === variant.color 
                          ? 'bg-primary border-primary text-black font-bold' 
                          : 'border-white/20 text-muted-foreground hover:border-white/50'}
                        ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                      {variant.color}
                      {variant.stock < 5 && variant.stock > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] px-1 rounded-full">Low Stock</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-black hover:bg-primary/90 h-14 uppercase tracking-widest font-serif"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 h-14 uppercase tracking-widest font-serif"
                >
                  Buy Now
                </Button>
              </div>
              
              {/* Partial COD Info Box */}
              <div className="bg-card/50 border border-primary/20 p-4 rounded-sm">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-primary uppercase tracking-wide mb-1">Payment Options</h4>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-white font-semibold">Prepaid:</span> Pay full amount now.<br/>
                      <span className="text-white font-semibold">Cash on Delivery:</span> Pay ₹100 shipping now, rest on delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Features Accordion/Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-card/30 rounded-none">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="returns">Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="p-4 bg-card/10 border border-t-0 border-white/5 mt-0">
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Premium Quality {product.brand} timepiece</li>
                  <li>Master Craftsmanship in every detail</li>
                  <li>7-Day Replacement Policy</li>
                </ul>
              </TabsContent>
              <TabsContent value="shipping" className="p-4 bg-card/10 border border-t-0 border-white/5 mt-0">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <Truck className="w-4 h-4 text-primary" /> Free Express Shipping
                </div>
                <p className="text-xs text-muted-foreground">Delivery within 3-5 business days across India.</p>
              </TabsContent>
              <TabsContent value="returns" className="p-4 bg-card/10 border border-t-0 border-white/5 mt-0">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <RefreshCw className="w-4 h-4 text-primary" /> 7 Day Returns
                </div>
                <p className="text-xs text-muted-foreground">Easy returns for unworn items in original packaging.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
