import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Clock, Package, CheckCircle2, 
  MessageSquare, ExternalLink, RefreshCw, LogOut,
  TrendingUp, Users, DollarSign, Loader2, Phone, MapPin
} from 'lucide-react';
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
        <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
        <span className="font-bold opacity-40">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold mb-2">Command Center</h1>
          <p className="text-brand-charcoal/40 font-medium">Real-time operations for Street Foods Corner</p>
        </div>
        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-2 px-6 py-3 bg-brand-charcoal text-white rounded-2xl hover:bg-brand-red transition-colors self-start"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: 'Total Sales', value: formatPrice(stats.totalSales), icon: DollarSign, color: 'text-green-500' },
          { label: 'New Orders', value: stats.newOrders, icon: Clock, color: 'text-blue-500' },
          { label: 'In Progress', value: stats.preparing, icon: Package, color: 'text-brand-orange' },
          { label: 'Ready for Pickup', value: stats.ready, icon: CheckCircle2, color: 'text-green-600' }
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[40px] shadow-sm border border-brand-charcoal/5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-bold opacity-40 uppercase mb-2 tracking-wider">{s.label}</p>
              <p className="text-3xl font-display font-bold">{s.value}</p>
            </div>
            <div className={cn("p-4 rounded-3xl bg-current opacity-10", s.color)} />
            <s.icon className={cn("absolute -translate-x-12 opacity-100", s.color)} size={32} />
          </motion.div>
        ))}
      </div>

      {/* Order Management */}
      <div className="bg-brand-charcoal p-10 rounded-[60px] shadow-2xl overflow-hidden min-h-[600px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp size={28} className="text-brand-orange" />
            Live Orders
          </h2>
          
          <div className="flex gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide">
            {['All', 'New', 'Preparing', 'Ready', 'Completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  filter === f ? "bg-white text-brand-charcoal shadow-lg" : "text-white/40 hover:text-white"
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
                <Package size={80} className="mb-6" />
                <p className="text-2xl font-bold">No orders found</p>
              </motion.div>
            ) : (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-[40px] group hover:border-brand-orange/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-8 justify-between">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          order.status === 'New' && "bg-brand-red text-white",
                          order.status === 'Preparing' && "bg-brand-orange text-white",
                          order.status === 'Ready' && "bg-green-500 text-white",
                          order.status === 'Completed' && "bg-white/20 text-white/40"
                        )}>
                          {order.status}
                        </span>
                        <span className="text-white/40 text-xs font-medium">#{order.id?.slice(-6).toUpperCase()}</span>
                      </div>
                      <h4 className="text-2xl font-bold text-white">{order.customerName}</h4>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1"><Phone size={14} /> {order.phone}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {order.type}</span>
                      </div>
                      {order.address && <p className="text-xs text-white/40 max-w-sm">{order.address}</p>}
                    </div>

                    {/* Order Details */}
                    <div className="flex-grow flex flex-wrap gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-white/10 px-4 py-2 rounded-xl text-sm text-white/80 border border-white/5">
                          <span className="font-bold text-brand-yellow mr-2">{item.quantity}x</span> {item.name}
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 lg:min-w-[200px]">
                      <div className="text-right mb-2">
                        <p className="text-brand-orange text-3xl font-display font-bold">{formatPrice(order.total)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {order.status === 'New' && (
                          <button onClick={() => updateStatus(order.id!, 'Preparing')} className="px-4 py-2 bg-brand-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-orange/20">
                            Start Prep
                          </button>
                        )}
                        {order.status === 'Preparing' && (
                          <button onClick={() => updateStatus(order.id!, 'Ready')} className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 flex items-center gap-1">
                            Ready <CheckCircle2 size={16} />
                          </button>
                        )}
                        {order.status === 'Ready' && (
                          <button onClick={() => updateStatus(order.id!, 'Completed')} className="px-4 py-2 bg-white text-brand-charcoal rounded-xl text-sm font-bold">
                            Complete
                          </button>
                        )}
                        <button className="p-2 text-white/40 hover:text-white transition-colors">
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
