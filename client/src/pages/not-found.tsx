import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center py-20 -mt-20">
        <div className="flex flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 lg:mb-16">
          <span className="text-6xl md:text-8xl lg:text-9xl font-serif font-light text-white leading-none tracking-tighter opacity-90">4</span>
          
          <div className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center">
            <motion.img 
              src="/attached_assets/watch1.png" 
              alt="Luxury Watch"
              className="w-full h-full object-contain scale-110 md:scale-125 lg:scale-150 filter drop-shadow-lg md:drop-shadow-[0_10px_40px_rgba(255,255,255,0.05)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <span className="text-6xl md:text-8xl lg:text-9xl font-serif font-light text-white leading-none tracking-tighter opacity-90">4</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-6 md:space-y-8 lg:space-y-10"
        >
          <h2 className="text-sm md:text-base lg:text-lg font-serif text-white/80 tracking-[0.25em] uppercase font-light italic mt-4 md:mt-6 lg:mt-8">
            Lost in time! This page is not ticking.
          </h2>
          
          <div className="pt-4 md:pt-6">
            <Link href="/">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white hover:text-black font-serif uppercase tracking-[0.4em] px-6 py-3 md:px-8 md:py-4 lg:px-12 lg:py-8 h-auto text-[10px] md:text-xs transition-all duration-700 bg-transparent rounded-none border-[0.5px]"
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
