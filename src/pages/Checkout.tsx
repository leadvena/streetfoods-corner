import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Truck, Package, Phone, MapPin, User, CheckCircle2, Loader2 } from 'lucide-react';
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
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[60px] text-center shadow-2xl"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-bold mb-4 font-display">Order Received!</h2>
          <p className="text-brand-charcoal/60 text-lg mb-10 leading-relaxed">
            We've received your order. We'll call you shortly at <span className="font-bold text-brand-charcoal">{formData.phone}</span> to confirm.
          </p>
          <Link to="/" className="btn-primary block w-full py-4 text-xl">Back to Home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/menu" className="flex items-center gap-2 text-brand-charcoal/40 hover:text-brand-orange transition-colors mb-12 font-bold group">
        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Menu
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-16">
        {/* Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-12">Checkout</h1>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <User size={24} className="text-brand-orange" />
                Customer Info
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-40 uppercase tracking-wider">Full Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white border border-brand-charcoal/10 rounded-2xl p-4 focus:ring-2 focus:ring-brand-orange outline-none"
                    placeholder="e.g. Juan Dela Cruz"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-40 uppercase tracking-wider">Phone Number</label>
                  <input 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-white border border-brand-charcoal/10 rounded-2xl p-4 focus:ring-2 focus:ring-brand-orange outline-none"
                    placeholder="e.g. 0912 345 6789"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Truck size={24} className="text-brand-orange" />
                Delivery Details
              </h3>
              
              <div className="flex gap-4 p-2 bg-brand-charcoal/5 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type: 'Delivery' }))}
                  className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all", formData.type === 'Delivery' ? "bg-white shadow-md text-brand-orange" : "text-brand-charcoal/40")}
                >
                  <Truck size={20} /> Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type: 'Pickup' }))}
                  className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all", formData.type === 'Pickup' ? "bg-white shadow-md text-brand-orange" : "text-brand-charcoal/40")}
                >
                  <Package size={20} /> Pickup
                </button>
              </div>

              {formData.type === 'Delivery' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-40 uppercase tracking-wider">Delivery Address (Tabogon Area)</label>
                  <textarea 
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                    rows={3}
                    className="w-full bg-white border border-brand-charcoal/10 rounded-2xl p-4 focus:ring-2 focus:ring-brand-orange outline-none resize-none"
                    placeholder="Barangay, Street, Landmark..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold opacity-40 uppercase tracking-wider">Additional Notes (Optional)</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-white border border-brand-charcoal/10 rounded-2xl p-4 focus:ring-2 focus:ring-brand-orange outline-none resize-none"
                  placeholder="Extra chili, please!"
                />
              </div>
            </div>
          </form>
        </motion.div>

        {/* Summary */}
        <aside className="relative">
          <div className="sticky top-32 bg-white card-immersive p-8 border-brand-red shadow-neo-orange">
            <h3 className="text-2xl font-black uppercase italic mb-8">Order Summary</h3>
            
            <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                  <div className="flex gap-3 items-center">
                    <span className="text-brand-red">x{item.quantity}</span>
                    <span className="opacity-80">{item.name}</span>
                  </div>
                  <span className="font-black italic">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t-[1.5px] border-brand-charcoal/10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40">
                <span>Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center text-3xl font-black italic pt-4">
                <span>Total</span>
                <span className="text-brand-red">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              disabled={isSubmitting || items.length === 0}
              className="w-full btn-primary py-5 text-lg font-black uppercase mt-10 flex items-center justify-center gap-3 disabled:opacity-50 transition-all border-2 border-brand-charcoal"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Place Order"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
