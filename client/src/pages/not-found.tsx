import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center py-20 -mt-20">
        <div className="flex flex-row items-center justify-center gap-2 md:gap-4 lg:gap-6 mb-8 md:mb-12 lg:mb-16">
          <span className="text-[10rem] md:text-[15rem] lg:text-[20rem] font-serif font-light text-white leading-none tracking-tighter opacity-90">4</span>
          
          <div className="relative w-[10rem] h-[10rem] md:w-[15rem] md:h-[15rem] lg:w-[20rem] lg:h-[20rem] flex items-center justify-center">
            <img 
              src="/attached_assets/watch1.png" 
              alt="Luxury Watch"
              className="w-full h-full object-contain filter drop-shadow-lg md:drop-shadow-[0_10px_40px_rgba(255,255,255,0.05)]"
            />
          </div>

          <span className="text-[10rem] md:text-[15rem] lg:text-[20rem] font-serif font-light text-white leading-none tracking-tighter opacity-90">4</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-6 md:space-y-8 lg:space-y-10"
        >
          <h2 className="text-lg md:text-2xl lg:text-3xl font-serif text-white/80 tracking-[0.25em] uppercase font-light italic">
            Lost in time! This page is not ticking.
          </h2>
          
          <div className="pt-4 md:pt-6">
            <Link href="/">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white hover:text-black font-serif uppercase tracking-[0.4em] px-8 py-4 md:px-10 md:py-5 lg:px-12 lg:py-6 h-auto text-[10px] md:text-xs transition-all duration-700 bg-transparent rounded-none border-[0.5px]"
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
