import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Loader2, ShieldAlert } from 'lucide-react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { MENU_ITEMS } from '../constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const navigate = useNavigate();

  const seedData = async () => {
    setIsSeeding(true);
    try {
      const batch = writeBatch(db);
      
      // Add admin (using current user if logged in, but here we just show how)
      // For this demo, let's just seed the menu
      for (const item of MENU_ITEMS) {
        const docRef = doc(db, 'menu', item.id);
        batch.set(docRef, { ...item, createdAt: new Date().toISOString() });
      }
      
      await batch.commit();
      alert('Menu seeded successfully! To become an admin, manually add your UID to the "admins" collection in Firebase Console.');
    } catch (err: any) {
      alert('Seeding failed: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user is admin
      const adminDoc = await getDoc(doc(db, 'admins', result.user.uid));
      if (adminDoc.exists()) {
        navigate('/admin');
      } else {
        setError('Unauthorized: Your account is not an admin.');
        await auth.signOut();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Check admin status
      const adminDoc = await getDoc(doc(db, 'admins', result.user.uid));
      if (adminDoc.exists()) {
        navigate('/admin');
      } else {
        setError('Unauthorized access.');
        await auth.signOut();
      }
    } catch (err: any) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-[60px] shadow-2xl border border-brand-charcoal/5"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-orange/10 text-brand-orange rounded-3xl flex items-center justify-center mx-auto mb-6">
            <LogIn size={40} />
          </div>
          <h1 className="text-4xl font-bold font-display mb-2">Admin Login</h1>
          <p className="text-brand-charcoal/40">Secure access for Tabogon Hub Staff</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-brand-red/10 text-brand-red rounded-2xl mb-8 text-sm font-medium">
            <ShieldAlert size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-bold opacity-40 uppercase tracking-wider ml-2">Email</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-charcoal/5 border border-transparent rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-brand-orange outline-none transition-all"
              placeholder="admin@streetfoods.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold opacity-40 uppercase tracking-wider ml-2">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-charcoal/5 border border-transparent rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-brand-orange outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={isLoading}
            className="w-full btn-primary py-4 text-xl font-bold flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-charcoal/10" /></div>
          <span className="relative bg-white px-4 text-sm font-bold opacity-20 uppercase">Or log in with</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-4 bg-white border border-brand-charcoal/10 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-charcoal/5 transition-colors disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Google Admin
        </button>

        <div className="mt-12 text-center">
            <button 
              onClick={seedData} 
              disabled={isSeeding}
              className="text-xs font-bold text-brand-orange/40 hover:text-brand-orange transition-colors uppercase tracking-widest"
            >
              {isSeeding ? 'Seeding...' : 'Seed Menu Data (Dev Only)'}
            </button>
        </div>
      </motion.div>
    </div>
  );
}
