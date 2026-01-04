import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-center gap-4 mb-8"
      >
        <span className="text-[6rem] md:text-[8rem] font-serif font-bold text-white leading-none">4</span>
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
          <motion.img 
            src="/attached_assets/watch1.png" 
            alt="Watch Dial"
            className="w-full h-full object-contain rounded-full border-2 border-primary/20 p-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span className="text-[6rem] md:text-[8rem] font-serif font-bold text-white leading-none">4</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h2 className="text-xl md:text-2xl font-serif italic text-primary mb-4 tracking-widest">
          Lost in time! This page is not ticking
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm md:text-base">
          The moment you're looking for has passed. Let's return to our collection.
        </p>
        <Link href="/">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black font-serif uppercase tracking-widest px-8 py-6 h-auto">
            Return to Time
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
