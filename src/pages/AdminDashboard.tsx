import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChartBar, Clock, Package, CheckCircle, 
  ChatTeardropText, ArrowSquareOut, ArrowsClockwise, SignOut,
  TrendUp, Users, CurrencyDollar, SpinnerGap, Phone, MapPin
} from '@phosphor-icons/react';
import { onSnapshot, collection, query, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Order, OrderStatus } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/login');
    });

    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      const orderList: Order[] = [];
      snapshot.forEach((doc) => {
        orderList.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(orderList);
      setIsLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeOrders();
    };
  }, [navigate]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      
      // WhatsApp notification logic
      if (status === 'Ready') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          const message = `Halo ${order.customerName}! Your order from Street Foods Corner Tabogon is READY! 🌯 Ready for ${order.type.toLowerCase()}. Total: ${formatPrice(order.total)}. See you!`;
          const encoded = encodeURIComponent(message);
          window.open(`https://wa.me/${order.phone.replace(/\+/g, '')}?text=${encoded}`, '_blank');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);
  
  const stats = {
    totalSales: orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0),
    newOrders: orders.filter(o => o.status === 'New').length,
    preparing: orders.filter(o => o.status === 'Preparing').length,
    ready: orders.filter(o => o.status === 'Ready').length,
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <SpinnerGap className="w-12 h-12 text-brand-accent animate-spin" weight="bold" />
        <span className="font-bold text-white/40 uppercase tracking-widest text-xs">Initializing Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 text-white">Command Center</h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Real-time operations for Street Foods Corner</p>
        </div>
        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-2 px-6 py-3 glass-inner text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all border border-red-500/20 hover:border-red-500 font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
        >
          <SignOut size={16} weight="bold" /> Terminate Session
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: 'Total Revenue', value: formatPrice(stats.totalSales), icon: CurrencyDollar, color: 'text-brand-accent shadow-[0_0_20px_rgba(0,210,255,0.2)]' },
          { label: 'Incoming', value: stats.newOrders, icon: Clock, color: 'text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' },
          { label: 'Processing', value: stats.preparing, icon: Package, color: 'text-brand-accent shadow-[0_0_20px_rgba(0,210,255,0.2)]' },
          { label: 'Ready/Staged', value: stats.ready, icon: CheckCircle, color: 'text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' }
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-[2rem] flex items-center justify-between overflow-hidden relative group"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">{s.label}</p>
              <p className="text-3xl font-display font-black text-white">{s.value}</p>
            </div>
            <s.icon className={cn("text-5xl opacity-20 group-hover:scale-110 transition-transform relative z-10", s.color)} weight="duotone" />
            
            {/* Ambient Glow */}
            <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-[40px] opacity-20", s.color.includes('brand-accent') ? 'bg-brand-accent' : 'bg-white')} />
          </motion.div>
        ))}
      </div>

      {/* Order Management */}
      <div className="glass-panel p-10 rounded-[3rem] overflow-hidden min-h-[600px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 border-b border-white/10 pb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <TrendUp size={28} weight="bold" className="text-brand-accent" />
            Live Telemetry
          </h2>
          
          <div className="flex gap-2 glass-inner p-2 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide">
            {['All', 'New', 'Preparing', 'Ready', 'Completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs uppercase tracking-widest font-bold transition-all",
                  filter === f ? "bg-brand-accent text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]" : "text-white/40 hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-white/20">
                <Package size={64} weight="thin" className="mb-6" />
                <p className="text-xl font-bold tracking-tight">No active signals</p>
              </motion.div>
            ) : (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-inner border border-white/5 p-8 rounded-[2rem] group hover:border-brand-accent/30 transition-colors relative overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row gap-8 justify-between relative z-10">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          order.status === 'New' && "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]",
                          order.status === 'Preparing' && "bg-brand-accent text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]",
                          order.status === 'Ready' && "bg-green-400 text-black shadow-[0_0_15px_rgba(74,222,128,0.3)]",
                          order.status === 'Completed' && "bg-white/10 text-white/40"
                        )}>
                          {order.status}
                        </span>
                        <span className="text-brand-accent/40 text-xs font-bold font-mono tracking-widest uppercase">#{order.id?.slice(-6)}</span>
                      </div>
                      <h4 className="text-2xl font-black uppercase tracking-tight text-white">{order.customerName}</h4>
                      <div className="flex items-center gap-4 text-xs font-bold tracking-wider text-white/60">
                        <span className="flex items-center gap-1.5"><Phone size={14} weight="bold" /> {order.phone}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} weight="bold" /> {order.type}</span>
                      </div>
                      {order.address && <p className="text-[10px] text-white/40 max-w-sm uppercase tracking-widest">{order.address}</p>}
                    </div>

                    {/* Order Details */}
                    <div className="flex-grow flex flex-wrap gap-3 content-start">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/80 border border-white/5">
                          <span className="text-brand-accent mr-2">x{item.quantity}</span> {item.name}
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 lg:min-w-[200px]">
                      <div className="text-right mb-2">
                        <p className="text-white text-2xl font-display font-black">{formatPrice(order.total)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {order.status === 'New' && (
                          <button onClick={() => updateStatus(order.id!, 'Preparing')} className="px-6 py-3 bg-brand-accent text-black rounded-xl text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:scale-105 transition-transform">
                            Initialize
                          </button>
                        )}
                        {order.status === 'Preparing' && (
                          <button onClick={() => updateStatus(order.id!, 'Ready')} className="px-6 py-3 bg-green-400 text-black rounded-xl text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(74,222,128,0.3)] flex items-center gap-2 hover:scale-105 transition-transform">
                            Stage <CheckCircle size={16} weight="bold" />
                          </button>
                        )}
                        {order.status === 'Ready' && (
                          <button onClick={() => updateStatus(order.id!, 'Completed')} className="px-6 py-3 glass-inner hover:bg-white text-white hover:text-black border border-white/20 rounded-xl text-xs uppercase tracking-widest font-bold transition-all">
                            Finalize
                          </button>
                        )}
                        <button className="p-3 text-white/40 hover:text-white glass-inner rounded-xl border border-white/10 transition-colors">
                          <ChatTeardropText size={18} weight="bold" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle Background Status Indicator */}
                  {order.status === 'New' && <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />}
                  {order.status === 'Preparing' && <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />}
                  {order.status === 'Ready' && <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
