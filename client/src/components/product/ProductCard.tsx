import { Link } from "wouter";
import { Product } from "@/lib/mockData";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/product/${product.id}`} className="group block h-full">
        <Card className="h-full bg-transparent border-none shadow-none overflow-hidden group-hover:bg-card/50 transition-colors duration-500 rounded-none cursor-pointer">
          <CardContent className="p-0 relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-card/30 to-background">
            {product.isNew && (
              <span className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 uppercase tracking-widest">
                New Arrival
              </span>
            )}
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 z-10 bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                Best Seller
              </span>
            )}

            <div className="w-full h-full flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-700 ease-out">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain drop-shadow-2xl"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
              <Button className="w-full bg-white text-black hover:bg-primary hover:text-primary-foreground font-serif uppercase tracking-widest text-xs pointer-events-none">
                View Details
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-start p-6 space-y-2">
            <span className="text-xs text-primary uppercase tracking-widest font-medium">
              {product.brand}
            </span>
            <h3 className="text-lg font-serif text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-muted-foreground font-light">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
