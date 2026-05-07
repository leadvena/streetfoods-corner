import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CaretLeft, Truck, Package, Phone, MapPin, User, CheckCircle, SpinnerGap } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/cartContext';
import { formatPrice, cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { OrderType } from '../types';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    type: 'Delivery' as OrderType,
    notes: ''
  });

  const deliveryFee = formData.type === 'Delivery' ? 30 : 0;
  const finalTotal = total + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        type: formData.type,
        notes: formData.notes,
        items: items,
        total: finalTotal,
        status: 'New',
        timestamp: serverTimestamp()
      });
      
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error("Order failed:", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 relative z-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full glass-panel p-12 rounded-[3rem] text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-brand-accent/20"
        >
          <div className="w-24 h-24 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,210,255,0.2)]">
            <CheckCircle size={48} weight="fill" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white">Transmission Successful</h2>
          <p className="text-white/60 text-sm mb-10 leading-relaxed font-bold">
            Order received. Our team will verify via comms channel <span className="text-brand-accent font-black">{formData.phone}</span> shortly.
          </p>
          <Link to="/" className="btn-primary block w-full py-4 text-sm font-bold tracking-widest">Return to Hub</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <Link to="/menu" className="inline-flex items-center gap-2 text-white/40 hover:text-brand-accent transition-colors mb-12 font-bold uppercase tracking-widest text-xs group">
        <CaretLeft size={16} weight="bold" className="group-hover:-translate-x-1 transition-transform" /> Return to Catalog
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-16">
        {/* Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 text-white">Finalize Order</h1>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-white border-b border-white/10 pb-4">
                <User size={24} weight="fill" className="text-brand-accent" />
                Client Matrix
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">Designation (Name)</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all text-white placeholder:text-white/20"
                    placeholder="e.g. Juan Dela Cruz"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">Comms Line (Phone)</label>
                  <input 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all text-white placeholder:text-white/20"
                    placeholder="e.g. 0912 345 6789"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-white border-b border-white/10 pb-4">
                <Truck size={24} weight="fill" className="text-brand-accent" />
                Logistics Setup
              </h3>
              
              <div className="flex gap-4 p-2 glass-inner rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type: 'Delivery' }))}
                  className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all", formData.type === 'Delivery' ? "bg-brand-accent text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]" : "text-white/40 hover:text-white")}
                >
                  <Truck size={18} weight="bold" /> Nitro Drop
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type: 'Pickup' }))}
                  className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all", formData.type === 'Pickup' ? "bg-brand-accent text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]" : "text-white/40 hover:text-white")}
                >
                  <Package size={18} weight="bold" /> Self Extraction
                </button>
              </div>

              {formData.type === 'Delivery' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">Coordinates (Tabogon Area Only)</label>
                  <textarea 
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none resize-none transition-all text-white placeholder:text-white/20"
                    placeholder="Barangay, Street, Landmark..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">Override Protocols (Notes)</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none resize-none transition-all text-white placeholder:text-white/20"
                  placeholder="Extra chili, specific instructions..."
                />
              </div>
            </div>
          </form>
        </motion.div>

        {/* Summary */}
        <aside className="relative">
          <div className="sticky top-32 glass-panel p-8 border-t-[4px] border-t-brand-accent rounded-[2rem]">
            <h3 className="text-xl font-black uppercase tracking-tight mb-8 text-white">Manifest</h3>
            
            <div className="space-y-6 mb-8 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                  <div className="flex gap-4 items-center">
                    <span className="text-brand-accent bg-brand-accent/10 px-2 py-1 rounded-md border border-brand-accent/20">x{item.quantity}</span>
                    <span className="text-white/80">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-white/10">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>Logistics Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-black pt-4 text-white">
                <span className="uppercase tracking-tight text-sm text-white/60">Total</span>
                <span className="text-brand-accent">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              disabled={isSubmitting || items.length === 0}
              className="w-full btn-primary py-5 text-sm font-bold uppercase tracking-widest mt-10 flex items-center justify-center gap-3 disabled:opacity-50 transition-all border border-brand-accent/20 hover:border-brand-accent/50 shadow-[0_0_20px_rgba(0,210,255,0.1)] hover:shadow-[0_0_30px_rgba(0,210,255,0.3)]"
            >
              {isSubmitting ? <SpinnerGap size={20} weight="bold" className="animate-spin" /> : "Authorize Protocol"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
