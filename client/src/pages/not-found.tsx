import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] bg-black flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="flex items-center justify-center gap-6 md:gap-12 mb-16">
          <span className="text-[7rem] md:text-[14rem] font-serif font-light text-white leading-none tracking-tighter opacity-90">4</span>
          <div className="relative w-44 h-64 md:w-64 md:h-96 flex items-center justify-center -translate-y-4">
            <img 
              src="/attached_assets/watch1.png" 
              alt="Luxury Watch"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_40px_rgba(255,255,255,0.05)]"
            />
          </div>
          <span className="text-[7rem] md:text-[14rem] font-serif font-light text-white leading-none tracking-tighter opacity-90">4</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-10"
        >
          <h2 className="text-xl md:text-3xl font-serif text-white/80 tracking-[0.25em] uppercase font-light italic">
            Lost in time! This page is not ticking.
          </h2>
          
          <div className="pt-6">
            <Link href="/">
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white hover:text-black font-serif uppercase tracking-[0.4em] px-12 py-8 h-auto text-xs transition-all duration-700 bg-transparent rounded-none border-[0.5px]"
              >
                Back to Homepage
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
