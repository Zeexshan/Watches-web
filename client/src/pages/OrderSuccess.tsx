import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)]"
        >
          <CheckCircle2 className="w-12 h-12 text-black" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">Order Confirmed</h1>
        <p className="text-muted-foreground text-lg max-w-md mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="bg-card/30 p-8 border border-white/5 rounded-lg max-w-md w-full mb-8">
          <p className="text-sm text-muted-foreground mb-4">Order Number: <span className="text-white font-mono">#ORD-2026-8892</span></p>
          <p className="text-sm text-muted-foreground">An email confirmation has been sent to your registered email address.</p>
        </div>

        <Link href="/">
          <Button size="lg" className="uppercase tracking-widest font-serif bg-primary text-black hover:bg-primary/90">
            Return to Home
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
