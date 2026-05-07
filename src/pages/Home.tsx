import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Star, Clock, Heart, ThumbsUp, MapPin, Phone, ChatCircle, Plus, Lightning } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { MENU_ITEMS } from '../constants';
import { useCart } from '../lib/cartContext';
import { formatPrice } from '../lib/utils';
import { useRef } from 'react';

export default function Home() {
  const { addToCart } = useCart();
  const featuredItems = MENU_ITEMS.slice(0, 5); // 5 items for a dense bento grid
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex flex-col gap-32 md:gap-48 overflow-hidden" ref={containerRef}>
      {/* Hero Section - Artistic Asymmetry */}
      <section className="relative min-h-[100dvh] flex items-center px-6 md:px-12 pt-24 pb-12 overflow-hidden">
        <motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=90&w=2000&sat=-50" 
            alt="Dark culinary background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/90 to-transparent" />
        </motion.div>

        <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 mb-8 glass-inner px-4 py-2 rounded-full w-max border border-brand-accent/30">
              <Lightning size={14} weight="fill" className="text-brand-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Tabogon Nitro Express</span>
            </div>
            
            <h1 className="text-[clamp(3rem,6vw,6.5rem)] font-black tracking-tighter leading-[0.9] text-balance mb-8 text-white uppercase">
              Street Food. <br/>
              <span className="text-gradient">Accelerated.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 font-sans leading-relaxed mb-12 max-w-[50ch]">
              Heritage flavors stripped down and rebuilt for speed. Experience Tabogon's finest, delivered with electric precision.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn-primary group">
                Initiate Order
                <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight size={16} weight="bold" />
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Abstract Glass Element instead of basic image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.3 }}
            className="lg:col-span-5 relative perspective-[1000px] hidden md:block"
          >
            <div className="w-full aspect-[4/5] glass-panel rounded-[2.5rem] p-4 relative transform-style-3d rotate-y-[-10deg] rotate-z-[2deg] hover:rotate-y-0 hover:rotate-z-0 transition-transform duration-1000 ease-out">
              <div className="w-full h-full rounded-[2rem] overflow-hidden relative inner-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1626509653295-ff204780775d?auto=format&fit=crop&q=90&w=800&sat=-20" 
                  className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                  alt="Premium Sisig"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                  <div>
                    <div className="text-brand-accent font-bold text-sm tracking-widest uppercase mb-1">Live Drop</div>
                    <div className="text-white font-display text-2xl font-bold">Nitro Sisig</div>
                  </div>
                  <div className="w-12 h-12 rounded-full glass-inner flex items-center justify-center backdrop-blur-md">
                    <Lightning size={20} weight="fill" className="text-brand-accent" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infinite Marquee */}
      <section className="relative py-8 border-y border-white/5 overflow-hidden flex items-center bg-white/[0.01]">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-16 items-center flex-nowrap"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              <span className="text-4xl font-display font-black text-white/10 uppercase italic">Maximum Flavor</span>
              <Star size={24} weight="fill" className="text-brand-accent/50" />
              <span className="text-4xl font-display font-black text-white/10 uppercase italic">Zero Compromise</span>
              <Lightning size={24} weight="fill" className="text-brand-accent/50" />
              <span className="text-4xl font-display font-black text-white/10 uppercase italic">Tabogon Local</span>
              <Heart size={24} weight="fill" className="text-brand-accent/50" />
              <span className="text-4xl font-display font-black text-white/10 uppercase italic">Electric Speed</span>
              <Clock size={24} weight="fill" className="text-brand-accent/50" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Bento Grid Section */}
      <section className="max-w-[1400px] mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">The Arsenal</h2>
          </div>
          <Link to="/menu" className="btn-secondary group">
            Full Catalog
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gapless Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[300px] grid-flow-dense">
          {featuredItems.map((item, index) => {
            // Determine span based on index to create an interlocking bento grid
            const isLarge = index === 0;
            const isWide = index === 1;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                className={`group relative glass-panel rounded-[2rem] overflow-hidden ${
                  isLarge ? 'md:col-span-2 md:row-span-2' : 
                  isWide ? 'md:col-span-2 md:row-span-1' : 
                  'md:col-span-1 md:row-span-1'
                }`}
              >
                <img 
                  src={item.image} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-40"
                  alt={item.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex justify-between items-end gap-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{item.category}</div>
                      <h3 className={`font-black uppercase tracking-tight text-white mb-2 ${isLarge ? 'text-4xl' : 'text-2xl'}`}>{item.name}</h3>
                      <div className="text-lg font-bold text-white/80">{formatPrice(item.price)}</div>
                    </div>
                    
                    <button 
                      onClick={(e) => { e.preventDefault(); addToCart(item); }}
                      className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                      <Plus size={20} weight="bold" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Cinematic Location / Philosophy */}
      <section className="max-w-[1400px] mx-auto w-full px-6 md:px-12 mb-32">
        <div className="glass-panel rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=90&w=2000&sat=-50')] opacity-10 bg-cover bg-center mix-blend-luminosity" />
          
          <div className="grid lg:grid-cols-2 gap-16 relative z-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80 }}
            >
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-8">
                Forged in Tabogon.
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-[45ch]">
                We don't do compromises. Every dish is precision-engineered using local produce and high-octane flavor profiles. From the grill to your door in absolute minimal time.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="glass-inner p-6 rounded-2xl">
                  <Lightning size={24} weight="fill" className="text-brand-accent mb-4" />
                  <div className="text-3xl font-black text-white mb-1">15m</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-white/40">Average Drop Time</div>
                </div>
                <div className="glass-inner p-6 rounded-2xl">
                  <Star size={24} weight="fill" className="text-brand-accent mb-4" />
                  <div className="text-3xl font-black text-white mb-1">4.9</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-white/40">User Satisfaction</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 60, delay: 0.2 }}
              className="relative aspect-square w-full max-w-[500px] mx-auto"
            >
              <div className="absolute inset-0 glass-inner rounded-full border border-white/10 animate-spin-slow opacity-50" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-4 glass-inner rounded-full border border-brand-accent/20 animate-spin-slow opacity-80" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              
              <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-white/10">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15664.123456789!2d123.9934!3d10.9272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a84e1b2c3d4e5f%3A0x6a7b8c9d0e1f2g3h!2sTabogon%2C%20Cebu!5e0!3m2!1sen!2sph!4v1715050000000!5m2!1sen!2sph" 
                  className="w-full h-full object-cover filter grayscale contrast-125 opacity-80 mix-blend-luminosity"
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              
              {/* Center Map Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(0,210,255,0.5)]">
                <MapPin size={24} weight="fill" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
