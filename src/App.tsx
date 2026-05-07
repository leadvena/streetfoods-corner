import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, List, User, House, MapPin, Phone } from '@phosphor-icons/react';
import { CartProvider, useCart } from './lib/cartContext';
import Home from './pages/Home';
import MenuPage from './pages/Menu';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { useState } from 'react';
import { cn } from './lib/utils';

function Navbar() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl h-16 glass-panel rounded-full flex items-center justify-between px-6"
    >
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-transform duration-500 group-hover:scale-110">
          <span className="text-black font-black text-sm uppercase">S</span>
        </div>
        <span className="font-bold text-lg tracking-tight uppercase hidden sm:block text-white">
          Street Foods
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 font-bold text-xs uppercase tracking-widest text-white/60">
        <NavLink to="/" label="Home" />
        <NavLink to="/menu" label="Menu" />
        
        <Link to="/menu" className="relative ml-4 group">
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:bg-brand-accent group-hover:text-black">
            <ShoppingBag size={18} weight="bold" />
            {itemCount > 0 && (
              <motion.div 
                layoutId="cart-badge"
                className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent rounded-full text-[9px] flex items-center justify-center font-bold text-black"
              >
                {itemCount}
              </motion.div>
            )}
          </div>
        </Link>
      </div>

      <div className="flex md:hidden items-center gap-4">
        <Link to="/menu" className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white">
          <ShoppingBag size={18} weight="bold" />
          {itemCount > 0 && (
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent rounded-full text-[9px] flex items-center justify-center font-bold text-black">
               {itemCount}
             </div>
          )}
        </Link>
        <button className="p-2 text-white/80" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <List size={24} weight="bold" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute top-20 left-0 right-0 glass-panel rounded-[2rem] p-8 flex flex-col gap-6 md:hidden shadow-2xl"
          >
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight text-white hover:text-brand-accent transition-colors">Home</Link>
            <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight text-white hover:text-brand-accent transition-colors">Menu</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ to, label }: { to: string, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={cn(
        "transition-colors hover:text-brand-accent",
        isActive ? "text-brand-accent" : ""
      )}
    >
      {label}
    </Link>
  );
}

function FloatingNav() {
  const location = useLocation();
  const isMenu = location.pathname === '/menu';
  
  if (isMenu) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden"
    >
      <div className="flex gap-2 p-2 glass-panel rounded-full">
        <Link to="/" className={cn("p-4 rounded-full transition-all", location.pathname === '/' ? "bg-brand-accent text-black" : "text-white/60 hover:text-white")}>
          <House size={20} weight="fill" />
        </Link>
        <Link to="/menu" className={cn("p-4 rounded-full transition-all", location.pathname === '/menu' ? "bg-brand-accent text-black" : "text-white/60 hover:text-white")}>
          <List size={20} weight="fill" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-[100dvh] relative bg-brand-bg selection:bg-brand-accent selection:text-black">
          {/* Ambient Background Layers (Ethereal Glass Noise/Gradient) */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-accent opacity-[0.03] blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent-secondary opacity-[0.03] blur-[100px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
          </div>

          <Navbar />
          <main className="relative z-10 pt-32 pb-32 md:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          
          <footer className="relative z-10 py-12 px-6 border-t border-white/5 bg-brand-bg flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span>J.P. Rizal St., Tabogon</span>
              <span className="text-brand-accent">Nitro Express</span>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 glass-inner rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-white/60 hover:text-brand-accent">
                <Phone size={16} weight="bold" />
              </div>
              <div className="w-10 h-10 glass-inner rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-white/60 hover:text-brand-accent">
                <MapPin size={16} weight="bold" />
              </div>
            </div>
          </footer>
          
          <FloatingNav />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
