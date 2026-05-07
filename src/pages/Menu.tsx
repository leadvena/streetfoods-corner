import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MagnifyingGlass, ShoppingBag, X, Plus, Minus, Trash } from '@phosphor-icons/react';
import { MENU_ITEMS } from '../constants';
import { Category } from '../types';
import { useCart } from '../lib/cartContext';
import { formatPrice, cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const CATEGORIES: Category[] = ['Mains', 'Sides', 'Drinks', 'Desserts'];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('Mains');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, addToCart, removeFromCart, updateQuantity, total, itemCount } = useCart();

  const filteredItems = MENU_ITEMS.filter(item => 
    item.category === activeCategory && 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[100dvh] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[150px]" />
      </div>

      {/* Header/Categories */}
      <div className="sticky top-28 z-40 px-6 max-w-7xl mx-auto mb-12">
        <div className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 text-xs tracking-wider uppercase",
                  activeCategory === cat 
                    ? "bg-brand-accent text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} weight="bold" />
            <input 
              type="text" 
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 rounded-full border border-white/10 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all text-white placeholder:text-white/30 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="group relative glass-panel rounded-[2rem] p-4 flex flex-col hover:border-white/20 transition-colors"
              >
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] mb-6">
                  <img src={item.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" alt={item.name} />
                  <div className="absolute top-4 right-4 glass-inner px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                    <span className="font-bold text-white text-sm">{formatPrice(item.price)}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">{item.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed flex-grow mb-6">{item.description}</p>
                
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full py-4 glass-inner hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-300 hover:text-brand-accent hover:border-brand-accent/50"
                >
                  <Plus size={16} weight="bold" />
                  Acquire
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-center justify-center py-32 opacity-50"
          >
            <MagnifyingGlass size={64} weight="thin" className="mb-6 text-white/30" />
            <p className="text-xl text-white font-bold tracking-tight">No items found matching your criteria.</p>
          </motion.div>
        )}
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-brand-surface z-[70] shadow-2xl flex flex-col border-l border-white/10"
            >
              <div className="p-8 flex items-center justify-between border-b border-white/5">
                <h2 className="text-2xl font-black uppercase tracking-tight">Acquisitions</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-3 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                  <X size={20} weight="bold" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingBag size={48} weight="thin" className="mb-6" />
                    <p className="text-lg font-medium tracking-tight">Your cache is empty</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-6 items-center">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={item.image} className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm uppercase tracking-tight mb-1">{item.name}</h4>
                        <p className="text-brand-accent font-bold mb-3">{formatPrice(item.price)}</p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center glass-inner rounded-full p-1 border border-white/10">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                              <Minus size={12} weight="bold" />
                            </button>
                            <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                              <Plus size={12} weight="bold" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 p-2 hover:bg-red-400/10 rounded-full transition-colors ml-auto shrink-0">
                            <Trash size={16} weight="bold" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 bg-brand-bg/50 border-t border-white/5 space-y-6 backdrop-blur-md">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white/60 uppercase tracking-widest text-xs">Total Transmission</span>
                  <span className="font-display text-2xl text-brand-accent">{formatPrice(total)}</span>
                </div>
                <Link 
                  to="/checkout" 
                  className={cn(
                    "w-full btn-primary block text-center py-4",
                    items.length === 0 && "opacity-50 pointer-events-none grayscale"
                  )}
                >
                  Initialize Checkout
                </Link>
                <p className="text-center text-[10px] uppercase tracking-widest text-white/30">Taxes and delivery fee calculated at checkout</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Cart Trigger */}
      <AnimatePresence>
        {itemCount > 0 && !isCartOpen && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-50 flex items-center gap-4 bg-brand-accent text-black px-6 py-4 rounded-full shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:scale-105 transition-transform"
          >
            <div className="relative">
              <ShoppingBag size={20} weight="fill" />
              <span className="absolute -top-2 -right-2 bg-brand-bg text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border border-brand-accent">{itemCount}</span>
            </div>
            <span className="font-bold border-l border-black/20 pl-4">{formatPrice(total)}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
