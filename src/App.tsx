import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu as MenuIcon, User, Home as HomeIcon, MapPin, Phone } from 'lucide-react';
import { CartProvider, useCart } from './lib/cartContext';
import Home from './pages/Home';
import MenuPage from './pages/Menu';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { useState } from 'react';

function Navbar() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-12 h-20 flex items-center justify-between border-b-[1.5px] border-brand-charcoal/10 bg-brand-cream/80 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center rotate-3 shadow-neo-sm group-hover:rotate-0 transition-transform">
          <span className="text-brand-cream font-black text-xl italic">S</span>
        </div>
        <span className="font-black text-2xl tracking-tighter uppercase italic hidden sm:block">
          Street Foods<span className="text-brand-red"> Corner</span>
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 font-black text-[11px] uppercase tracking-widest">
        <NavLink to="/" label="Home" />
        <NavLink to="/menu" label="Menu" />
        
        <Link to="/menu" className="relative ml-4 group">
          <div className="w-12 h-12 bg-brand-charcoal rounded-full flex items-center justify-center text-white shadow-xl group-hover:bg-brand-orange transition-colors">
            <ShoppingBag size={20} strokeWidth={2.5} />
            {itemCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange rounded-full text-[10px] flex items-center justify-center border-2 border-brand-cream font-bold"
              >
                {itemCount}
              </motion.div>
            )}
          </div>
        </Link>
      </div>

      <div className="flex md:hidden items-center gap-4">
        <Link to="/menu" className="w-10 h-10 bg-brand-charcoal rounded-full flex items-center justify-center text-white">
          <ShoppingBag size={18} />
        </Link>
        <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuIcon size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 glass rounded-3xl p-8 flex flex-col gap-6 md:hidden shadow-3xl border-2 border-brand-charcoal"
          >
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black italic uppercase tracking-tight">Home</Link>
            <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black italic uppercase tracking-tight">Menu</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ to, label }: { to: string, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={cn(
        "transition-all border-b-2",
        isActive ? "text-brand-red border-brand-red" : "border-transparent text-brand-charcoal/60 hover:text-brand-orange"
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="flex gap-2 p-2 glass rounded-full shadow-2xl border-brand-orange/10">
        <Link to="/" className={cn("p-4 rounded-full transition-all", location.pathname === '/' ? "bg-brand-orange text-white" : "hover:bg-brand-orange/10")}>
          <HomeIcon size={20} />
        </Link>
        <Link to="/menu" className={cn("p-4 rounded-full transition-all", location.pathname === '/menu' ? "bg-brand-orange text-white" : "hover:bg-brand-orange/10")}>
          <MenuIcon size={20} />
        </Link>
      </div>
    </div>
  );
}

import { cn } from './lib/utils';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen relative selection:bg-brand-orange/30 selection:text-brand-orange">
          {/* Ambient Background Layers */}
          <div className="ambient-bg">
            <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-brand-yellow opacity-10 blur-[120px]" />
            <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-brand-orange opacity-10 blur-[100px]" />
          </div>

          <Navbar />
          <main className="relative z-10 pt-24 pb-20 md:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          
          <footer className="relative z-10 h-16 px-6 md:px-12 bg-brand-charcoal text-brand-cream flex items-center justify-between">
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest overflow-hidden whitespace-nowrap">
              <span className="opacity-50 hidden sm:inline">J.P. Rizal St., Tabogon</span>
              <span className="text-brand-yellow">Open Until 10:00 PM</span>
              <span className="opacity-50">+63 955 853 3678</span>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <Phone size={14} />
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <MapPin size={14} />
              </div>
            </div>
          </footer>
          
          <FloatingNav />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
