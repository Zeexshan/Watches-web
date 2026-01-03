import { useState, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const bestSellers = products.filter((p: any) => p.isBestSeller).slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#020B0E]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('/attached_assets/watch1.png')] bg-cover bg-center opacity-40 bg-no-repeat"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <span className="text-primary text-sm uppercase tracking-[0.3em] font-medium">
                New Collection 2026
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
                Timeless <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                  Elegance
                </span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md font-light leading-relaxed">
                Discover our curated collection of luxury timepieces and
                accessories. Crafted for those who appreciate the finer things.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="bg-primary text-black hover:bg-primary/90 px-8 py-6 rounded-none font-serif tracking-widest uppercase transition-all duration-300"
                  >
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/shop?category=Watches">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-none font-serif tracking-widest uppercase"
                  >
                    View Watches
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden md:flex justify-center relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
              <img
                src="/attached_assets/watch1.png"
                alt="Luxury Watch"
                className="max-w-md w-full drop-shadow-[0_20px_50px_rgba(243,175,0,0.15)] object-contain z-10 hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-background border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Best Sellers
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground">
              Loading luxury items...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {bestSellers.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-[#020B0E] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/shop?category=Watches">
              <div className="relative h-64 bg-card/10 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-[url('/attached_assets/watch1.png')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <h3 className="relative text-3xl font-serif text-white group-hover:text-primary transition-colors z-10">
                  Watches
                </h3>
              </div>
            </Link>
            <Link href="/shop?category=Sunglasses">
              <div className="relative h-64 bg-card/10 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-[url('/attached_assets/sunglasses1.png')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <h3 className="relative text-3xl font-serif text-white group-hover:text-primary transition-colors z-10">
                  Sunglasses
                </h3>
              </div>
            </Link>
            <Link href="/shop?category=Attar">
              <div className="relative h-64 bg-card/10 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-[url('/attached_assets/attar1.png')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <h3 className="relative text-3xl font-serif text-white group-hover:text-primary transition-colors z-10">
                  Attar
                </h3>
              </div>
            </Link>
            <Link href="/shop?category=Belts">
              <div className="relative h-64 bg-card/10 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-[url('/attached_assets/belt1.png')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <h3 className="relative text-3xl font-serif text-white group-hover:text-primary transition-colors z-10">
                  Belts
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
