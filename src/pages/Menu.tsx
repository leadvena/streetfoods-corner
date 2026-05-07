import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import { Category, MenuItem as MenuItemType } from '../types';
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
    <div className="min-h-screen bg-brand-cream relative">
      {/* Header/Categories */}
      <div className="sticky top-20 z-40 bg-brand-cream/80 backdrop-blur-md px-4 py-6 border-b border-brand-charcoal/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-full font-bold whitespace-nowrap transition-all duration-300 text-sm",
                  activeCategory === cat 
                    ? "bg-brand-charcoal text-white shadow-lg" 
                    : "bg-white text-brand-charcoal/60 hover:bg-brand-charcoal/5"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/30" size={20} />
            <input 
              type="text" 
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white rounded-full border border-brand-charcoal/10 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group p-4 bg-white rounded-[40px] border-[1.5px] border-brand-charcoal shadow-neo-sm hover:shadow-neo transition-all duration-500 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden rounded-[32px] mb-6 border border-brand-charcoal/5">
                  <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                  <div className="absolute top-4 right-4 badge-premium bg-white/95 pb-1">
                    <span className="font-black italic text-sm">{formatPrice(item.price)}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-black uppercase italic mb-2 group-hover:text-brand-red transition-colors">{item.name}</h3>
                <p className="text-brand-charcoal/60 text-xs font-bold uppercase tracking-wider mb-6 leading-relaxed flex-grow">{item.description}</p>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full py-4 bg-brand-charcoal text-brand-cream rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-brand-red shadow-neo-orange transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  <Plus size={18} />
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Cart Button (Mobile) */}
      {itemCount > 0 && !isCartOpen && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-brand-orange text-white px-8 py-4 rounded-full shadow-2xl md:hidden"
        >
          <ShoppingBag size={24} />
          <span className="font-bold">View Cart ({itemCount})</span>
          <span className="font-display font-bold border-l border-white/20 pl-3">{formatPrice(total)}</span>
        </motion.button>
      )}

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-brand-cream z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-brand-charcoal/5">
                <h2 className="text-3xl font-bold">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-brand-charcoal/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingBag size={64} className="mb-4" />
                    <p className="text-xl font-medium">Your cart is empty</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-6 items-center">
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className="text-brand-orange font-bold font-display">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center bg-brand-charcoal/5 rounded-full p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-white rounded-full transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-white rounded-full transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-brand-red p-2 hover:bg-brand-red/10 rounded-full transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 bg-white glass-edge space-y-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Subtotal</span>
                  <span className="font-display text-2xl text-brand-orange">{formatPrice(total)}</span>
                </div>
                <Link 
                  to="/checkout" 
                  className={cn(
                    "w-full btn-primary block text-center py-5 text-xl font-bold",
                    items.length === 0 && "opacity-50 pointer-events-none grayscale"
                  )}
                >
                  Checkout
                </Link>
                <p className="text-center text-sm text-brand-charcoal/40">Taxes and delivery fee calculated at checkout</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Trigger (Desktop) */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 z-50 hidden md:flex items-center gap-4 bg-brand-charcoal text-white px-8 py-4 rounded-full shadow-2xl hover:bg-brand-orange transition-all hover:scale-105 active:scale-95 group"
      >
        <div className="relative">
          <ShoppingBag size={24} />
          {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-brand-red w-4 h-4 rounded-full text-[10px] flex items-center justify-center">{itemCount}</span>}
        </div>
        <span className="font-bold border-l border-white/20 pl-4">{formatPrice(total)}</span>
      </button>
    </div>
  );
}
